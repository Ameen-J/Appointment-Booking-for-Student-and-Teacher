const Student = require("../models/studentModel.js");
const Teacher = require("../models/teacherModel.js");
const Session = require("../models/sessionModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleUserRegistration = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    let UserModel = role === "teacher" ? Teacher : Student;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        message: "User with same email already exists",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserRecord = new UserModel({
      email,
      password: hashedPassword,
      name,
      role,
    });
    if (role === "teacher" && req.body.speciality) {
      newUserRecord.speciality = req.body.speciality;
    }
    await newUserRecord.save();
    
    res
      .status(201)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    res.status(500).send({ message: "Server error during registration", success: false });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let UserModel = role === "teacher" ? Teacher : Student;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Invalid credentials", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send({
        message: "Invalid credentials",
        success: false,
      });
    }
    const token =  jwt.sign(
      { id: user._id, myRole: role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    
    res
      .status(200)
      .send({ message: "Login Successful", success: true, data: { token } });
  } catch (error) {
    res.status(500).send({ message: "Server error during login", success: false, error });
  }
};

const getAuthenticatedUserProfile = async (req, res) => {
  try {
    const { userRole, authenticatedUserId } = req.body;
    let UserModel = userRole === "teacher" ? Teacher : Student;
    
    const user = await UserModel.findOne({ _id: authenticatedUserId }).select('-password -__v');
    
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    } 
    
    let profileData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: userRole,
    };
    
    if (userRole === "teacher" && user.speciality) {
      profileData["speciality"] = user.speciality;
    }
    
    return res.status(200).send({
      success: true,
      data: profileData,
    });
    
  } catch (error) {
    return res.status(500).send({
      message: "Error retrieving user profile",
      success: false,
    });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const teacherRecords = await Teacher.find().select('-password -__v');
    
    const teacherProfiles = teacherRecords.map((teacher) => ({
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        speciality: teacher.speciality,
    }));
    
    res.status(200).send({ success: true, data: teacherProfiles });
  } catch (error) {
    return res.status(500).send({
      message: "Error retrieving teacher list",
      success: false,
    });
  }
};

const getTeacherProfileWithAppointments = async (req, res) => {
  try {
    const teacherId = req.body.teacherID || req.body.authenticatedUserId; 

    const teacher = await Teacher.findOne({ _id: teacherId }).select('-password -__v');

    if (!teacher) {
         return res.status(404).send({
            message: "Teacher not found",
            success: false,
        });
    }

    const upcomingAppointments = await Session.find({
      teacherID: teacherId,
    }).sort({ scheduleDateTime: 1 });

    return res.status(200).send({
      success: true,
      data: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        speciality: teacher.speciality,
        appointmentSlots: upcomingAppointments,
      },
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error retrieving teacher profile and appointments",
      success: false,
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { teacherId, appointmentTime } = req.body; 
    
    const authenticatedStudentId = req.body.authenticatedUserId;
    
    const existingAppointment = await Session.findOne({
      teacherID: teacherId,
      scheduleDateTime: appointmentTime,
    });

    if (existingAppointment) {
      return res
        .status(400) 
        .json({ success: false, message: "This appointment slot is already taken" });
    } 

    const newAppointment = new Session({
      studentID: authenticatedStudentId,
      teacherID: teacherId,
      scheduleDateTime: appointmentTime,
      status: "pending", 
    });

    await newAppointment.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Appointment booking request submitted successfully",
        appointment: newAppointment,
      });
    
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating appointment",
        error: error.message,
      });
  }
};

const getUserAppointments = async (req, res) => {
    try {
      const { userRole, authenticatedUserId } = req.body;
      
      const roleIdField = userRole === 'student' ? "studentID" : "teacherID"
      
      const appointments = await Session.find({ [roleIdField]: authenticatedUserId })
        .populate("teacherID", "name")
        .populate("studentID", "name")
        .sort({ scheduleDateTime: 1 });
        
      res.status(200).json({ success: true, data: appointments });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error retrieving appointments" });
    }
  }

const updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.id; 
    const { status } = req.body;
    
    if (!status || !['pending', 'approved', 'cancelled', 'completed'].includes(status)) {
        return res.status(400).send({
            success: false,
            message: "Invalid status provided.",
        });
    }

    const updatedAppointment = await Session.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
         return res.status(404).send({
            success: false,
            message: "Appointment not found.",
        });
    }
    
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated Successfully",
    });
    
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error updating status" });
  }
};

const deleteAppointment = async(req,res)=>{
  try {
    const appointmentId = req.params.id;
    
    const deletedResult = await Session.deleteOne({_id: appointmentId})
    
    if (deletedResult.deletedCount === 1) {
      res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error deleting appointment' });
  }
}

module.exports = {
  handleUserRegistration,
  handleUserLogin,
  getAuthenticatedUserProfile,
  createAppointment,
  getAllTeachers,
  getTeacherProfileWithAppointments,
  getUserAppointments,
  updateAppointmentStatus,
  deleteAppointment
};