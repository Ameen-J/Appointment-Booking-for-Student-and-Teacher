import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";

const TeacherCard = ({ teacherData }) => {
  const navigate = useNavigate();

  const { id: teacherId, name, subjectExpertise } = teacherData;

  function navigateToBooking() {
    navigate(`/teacher/schedule-session/${teacherId}`);
  }

  return (
    <Card
      style={{
        width: "18rem",
        margin: "1rem",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.3s",
      }}
      className="border-0 rounded-3 h-100 hover-scale"
    >
      <div className="p-3 d-flex justify-content-center">
        <Image
          variant="top"
          src="./assets/TeacherIcon.png"
          alt={name}
          fluid
          roundedCircle
          style={{ objectFit: "cover", width: "120px", height: "120px", border: "3px solid #007bff" }}
        />
      </div>
      <Card.Body className="text-center d-flex flex-column justify-content-between">
        <Card.Title className="mb-2 fs-4 fw-bold text-dark">{name}</Card.Title>
        <Card.Text className="text-muted mb-3">
          Expertise: <span className="fw-semibold text-primary">{subjectExpertise}</span>
        </Card.Text>

        <div className="mt-2">
          <Button variant="outline-primary" onClick={navigateToBooking} className="w-75 fw-bold">
            Book Session
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TeacherCard;