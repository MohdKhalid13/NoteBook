var jwt = require('jsonwebtoken');

const JWT_SECRET = "MohdKhalid@13";

const FetchUser = (req,res,next) => {
    // Get User From The JWT and add id to req object
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error : "Please Authenticate using a Valid Token"}) 
    }
    try {
        const data = jwt.verify(token, JWT_SECRET );
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).send({error : "Please Authenticate using a Valid Token"}) 
    }
}

module.exports = FetchUser