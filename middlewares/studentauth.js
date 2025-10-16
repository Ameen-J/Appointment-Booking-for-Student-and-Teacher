function isStudent(req,res,next){
    try{
        if(req.body.userRole === 'student'){
            next()
        }
        else{
            res.status(403).send({
                message: "Access Forbidden: Insufficient permissions (Student required)",
                success:false
            })
        }
    }
    catch(error){
        return res.status(500).send({
            message: "Internal Server Error ",
            success: false
        })
    }
}

module.exports = isStudent