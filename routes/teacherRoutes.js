const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser.js");
const isTeacher = require("../middlewares/isTeacher.js");

const {
    updateAppointmentStatus,
    getTeacherProfileWithAppointments
} = require('../controllers/userController.js');

router.use(express.json());

router.put("/appointments/:id", authenticateUser, isTeacher, updateAppointmentStatus);

router.post("/profile/appointments", authenticateUser, isTeacher, getTeacherProfileWithAppointments);


module.exports = router;