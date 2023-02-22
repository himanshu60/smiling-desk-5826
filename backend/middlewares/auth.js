const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const auth  = (req, res, next)=>{
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.key);
    if(decoded){
        req.body.user_id = decoded._id;
        next();
    } else {
        res.status(401).json({msg: "Please login first"});
    }
}

module.exports = { auth }