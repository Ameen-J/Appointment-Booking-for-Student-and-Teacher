const express = require("express")
const app = express()
require('dotenv').config()
const dbConfig = require("./config/dbConfig")
const studentRoutes = require('./routes/studentRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const cors = require("cors")
const port = 5000


app.use(cors())
app.use(express.json())


app.use('/api/student/', studentRoutes) 
app.use('/api/teacher/', teacherRoutes)

app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
})