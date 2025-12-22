const User = require("../models/User");
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({success: false, message: 'Access token missing'});
  

    // Format: Bearer <token>
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({success: false, message: 'Invalid token format'});

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

module.exports = verifyToken;