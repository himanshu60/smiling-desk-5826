const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const auth = (req, res, next) => {
    // Accept either a raw token or the standard "Bearer <token>" scheme.
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;

    if (!token || token === "null" || token === "undefined") {
        return res.status(401).json({ msg: "Please login first" });
    }

    try {
        const decoded = jwt.verify(token, process.env.key);
        // Expose the authenticated user id on the request. Keep it on req.body
        // too so POST handlers that build a document from req.body keep working.
        req.user_id = decoded._id;
        req.body.user_id = decoded._id;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Invalid or expired session. Please login again." });
    }
};

module.exports = { auth };
