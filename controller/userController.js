const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) return res.status(400).json({success: false, message: "Email and password are required"});

        const foundUser = await User.findOne({email}).exec();
        if(foundUser) return res.status(400).json({success: false, message: "Email is existed"});

        const result = await User.create({email, password});
        return res.status(200).json({success: true, message: `User is created successfully`, result});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const auth = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) return res.status(400).json({success: false, message: "Email and password are required"});

        const foundUser = await User.findOne({email}).exec();
        if(!foundUser) return res.status(404).json({success: false, message: "User not found"});

        const match = await foundUser.verifyPassword(password);
        if(!match) return res.status(404).json({success: false, message: "Password incorrect"});

        const refreshToken = await jwt.sign(
            {email: foundUser.email},
            process.env.REFRESH_SECRET_TOKEN,
            {expiresIn: '10m'}
        );

        const accessToken = await jwt.sign(
            {
                user: {
                    email: foundUser.email,
                    userId: foundUser._id.toString()
                }
            },
            process.env.ACCESS_SECRET_TOKEN,
            {expiresIn: '10d'}
        );

        res.cookie(
            "accessToken",
            accessToken,
            {httpOnly: true}
        );

        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        return res.status(200).json({success: true, message: "Log in successfully", accessToken});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

module.exports = { register, auth };