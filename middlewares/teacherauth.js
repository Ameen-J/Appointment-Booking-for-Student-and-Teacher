function isTeacher(req,res,next){
    try{
        if(req.body.userRole === 'teacher'){
            next()
        }
        else{
            res.status(403).send({
                message: "Access Forbidden: Insufficient permissions (Teacher required)",
                success:false
            })
        }
    }
    catch(error){
        return res.status(500).send({
            message: "Internal Server Error during authorization check",
            success: false
        })
    }
}

module.exports = isTeacher