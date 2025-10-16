const mongoose = require("mongoose")


const sessionSchema =  new mongoose.Schema({
    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    teacherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teachers',
        required: true
    },
    scheduleDateTime:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['pending', 'accepted', 'cancelled', 'completed'],
        default: 'pending'
    }
},{
    timestamps: true
})

const sessionModel = mongoose.model('sessions',sessionSchema)

module.exports = sessionModel;