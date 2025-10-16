const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser.js");
const isStudent = require("../middlewares/isStudent.js");

const {
  handleUserRegistration, 
  handleUserLogin, 
  getAuthenticatedUserProfile,
  getUserAppointments,
  getAllTeachers,
  createAppointment,
  getTeacherProfileWithAppointments,
  updateAppointmentStatus,
  deleteAppointment
}  = require('../controllers/userController.js')


router.use(express.json());

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);

router.get("/profile", authenticateUser, getAuthenticatedUserProfile);

router.get("/teachers", authenticateUser, isStudent, getAllTeachers);

router.post("/teachers/profile", authenticateUser, isStudent, getTeacherProfileWithAppointments);

router.post("/appointments", authenticateUser, isStudent, createAppointment);

router.get("/appointments", authenticateUser, getUserAppointments);

router.put("/appointments/:id", authenticateUser, updateAppointmentStatus);

router.delete('/appointments/:id', authenticateUser, deleteAppointment)

module.exports = router;