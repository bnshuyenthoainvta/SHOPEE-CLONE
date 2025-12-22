const User = require('../models/User');
const Refreshtoken= require('../models/Refreshtoken');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const registerUser = async (req, res) => {
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

const authUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) return res.status(400).json({success: false, message: "Email and password are required"});

        const foundUser = await User.findOne({email}).select("password");
        if(!foundUser) return res.status(404).json({success: false, message: "User not found"});

        const match = await foundUser.comparePassword(password);
        if(!match) return res.status(404).json({success: false, message: "Password incorrect"});

        const refreshToken = jwt.sign(
            {userId: foundUser._id.toString()},
            process.env.REFRESH_SECRET_TOKEN,
            {expiresIn: '10d'}
        );

        const accessToken = jwt.sign(
            {
                user: {
                    email: foundUser.email,
                    userId: foundUser._id.toString()
                }
            },
            process.env.ACCESS_SECRET_TOKEN,
            {expiresIn: '10m'}
        );

        res.cookie(
            "refreshToken",
            refreshToken,
            {httpOnly: true, maxAge: 10*24*60*60*1000}
        );

        await Refreshtoken.create({
            token: refreshToken, 
            user: foundUser._id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        return res.status(200).json({success: true, message: "Log in successfully", accessToken});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        if(!userId) return res.status(401).json({success: false, message: "You have to log in first"});
        const {name, password, phone, address} = req.body;
        if(!name && !password && !phone && !address) return res.status(400).json({success: false, message: "Nothing to update"});

        const updateFields = {};
        // Name
        if (name) updateFields.name = name;

        // Phone
        if (phone) updateFields.phone = phone;

        // Address
        if (address) updateFields.address = address;

        // Password - phải hash lại
        if (password) updateFields.password = await argon2.hash(password);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true } 
        ).select("-refreshToken");

        if (!updatedUser) return res.status(404).json({success: false, message: "User not found"});

        return res.status(200).json({success: true, message: "Update successfully", user: updatedUser});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        if(!userId) return res.status(401).json({success: false, message: "You have to log in first"});
        
        const result = await User.findByIdAndDelete(userId);
        if(!result) return res.status(404).json({success: false, message: "User not found"});
        return res.status(200).json({success: true, message: "Delete successfully", result});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const resetAccessToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if(!token) return res.status(401).json({success: false, message: "Refresh token missing"});

        const decoded = jwt.verify(token, process.env.REFRESH_SECRET_TOKEN);

        const foundToken = await Refreshtoken.findOne({token}).populate("user");
        if(!foundToken) return res.status(404).json({success: false, message: "Refresh token not found"});

        if (decoded.userId !== foundToken.user._id.toString()) return res.status(409).json({success: false, message: "Conflict information"});

        const accessToken = jwt.sign(
            {
                user : 
                {
                    email: foundToken.user.email,
                    userId: foundToken.user._id
                }
            },
            process.env.ACCESS_SECRET_TOKEN,
            {expiresIn: "10m"}
        );

        return res.status(200).json({success: true, message: "Created new access token successfully", accessToken});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

module.exports = { registerUser, authUser, updateUser, deleteUser, resetAccessToken };