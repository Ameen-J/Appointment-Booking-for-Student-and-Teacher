import React, { useState, useEffect } from "react";
import Layout from "../components/AppLayout";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const BookingPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user);
  const [teacher, setTeacher] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  
  const [availableSlots, setAvailableSlots] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  
  const data = { teacherID: params.teacherID };

  useEffect(() => {
    async function fetchData() {
      
      try {
       
        const response = await fetch(`http://localhost:5000/api/student/teachers/profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        });
        const responseData = await response.json();
        
        setTeacher(responseData.data);
      } catch (error) {
       
      }
    }
    if (!teacher) {
      fetchData();
    }
  }, []);

  

  const handleSubmitBooking = async (event) => {
    event.preventDefault();
    if (!selectedDateTime) {
      toast.error("Please select a date and time.");
      return;
    }

    
   
    const bookingSchedule = selectedDateTime.toISOString()
  
   
    const bookingData = {
      teacherId: teacher?.id, 
      appointmentTime: bookingSchedule
    };
    
    try {
      setIsLoading(true);
     
      const response = await fetch(`http://localhost:5000/api/student/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await response.json();
      
      if (response.status === 201) {
        toast.success(responseData.message);
     
        navigate('/user-appointments')
      } else {
        toast.error(responseData.message);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Internal server error");
      console.error("Error:", error);
    }
  };

  return (
    <Layout>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="teacher-details mb-4">
                    <h2 className="card-title text-primary">{teacher?.name}</h2>
                    <p className="card-text">
                      <strong>Speciality: </strong> {teacher?.speciality}
                    </p>
                    <p className="card-text">
                      <strong>Email:</strong> {teacher?.email}
                    </p>
                  </div>

                  <form onSubmit={handleSubmitBooking}>
                    <div className="date-time-picker mb-3  d-flex align-items-center">
                    <strong>
                      Schedule: &nbsp;
                    </strong>
                      <DateTimePicker
                        label="Choose Date/Time"
                        value={selectedDateTime}
                        onChange={(newValue) => setSelectedDateTime(newValue)}
                        minutesStep={30}
                        minTime={dayjs().set("hour", 9).startOf("hour")}
                        maxTime={dayjs().set("hour", 17).startOf("hour")}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg btn-block"
                      disabled={isLoading || !selectedDateTime}
                    >
                      {isLoading ? "Booking..." : "Book Now"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </Layout>
  );
};

export default BookingPage;