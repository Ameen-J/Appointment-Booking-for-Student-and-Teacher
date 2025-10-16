const jwt  = require("jsonwebtoken")

function authenticateUser(req,res,next){
    try{
        if (!req.headers["authorization"]) {
            return res.status(401).send({ message: "Authentication required (No token)", success: false });
        }
        
        const token = req.headers["authorization"].split(" ")[1]
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(401).send({
                    message: "Authentication failed (Invalid token)",
                    success: false
                })
            }
            else{
                req.body.userRole = decoded.myRole 
                req.body.authenticatedUserId = decoded.id
                next()
            }
        })
    }
    catch(error){
        return res.status(401).send({
            message: "Authentication failed (Malformed header)",
            success: false
        })
    }
}

module.exports = authenticateUser