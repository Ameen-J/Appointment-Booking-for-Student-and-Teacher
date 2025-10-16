import react, { useEffect } from "react";
import Layout from "../components/AppLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
function Home() {
  const [appointments, setAppointments] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const fetchAppointments = async () => {
    

    try {
      
      if (user) {
        
        const response = await fetch(`http://localhost:5000/api/student/appointments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        
        
        setAppointments(data.data); 
        setIsLoading(false);
        setError(false);
      }
    } catch (error) {
      
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if(!appointments){
      fetchAppointments();

    }
  }, [user]);
  const handleBookSession = () => {
    
    navigate("/book-appointment");
    
  };

  function upcomingAppointmentExists(appointments){
    if(!appointments) return false
    const nextAppointment = appointments.find(
      (appointment) => appointment.status === "accepted"
    ); 
    return nextAppointment
  }
  function UpcomingAppointment({ appointments }) {
  
    const nextAppointment = appointments.find(
      (appointment) => appointment.status === "accepted"
    ); 
    return (
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">Upcoming Appointment</h5>
          <p className="card-text">
            
            Date:{" "}
            {dayjs(nextAppointment?.scheduleDateTime).format(
              "MMMM D, YYYY"
            )}{" "}
            <br />
            Time: {dayjs(nextAppointment?.scheduleDateTime).format("hh:mm A")}
            <br />
            {user?.role === "teacher" ? (
              <>Student Name: {nextAppointment?.studentID.name}</>
            ) : (
              <>Teacher Name: {nextAppointment?.teacherID.name}</>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container">
        {isLoading ? (
          <div className="text-center mt-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div> 
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            Error fetching appointments: {error.message}
          </div>
        ) : !upcomingAppointmentExists(appointments) ? (
          <div className="text-center mt-5">
            <p className="h3">You have no confirmed appointments.</p>
          </div>
        ) : (
          <UpcomingAppointment appointments={appointments} />
        )}
        {user?.role ===
          "student" ? (
            <button
              type="button"
              className="btn btn-primary btn-lg mt-5"
              onClick={handleBookSession}
            >
              Book Session Now
            </button>
          ) : (<></>)}
      </div>
    </Layout>
  );
}

export { Home };