const User = require('../models/User');
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

        const foundUser = await User.findOne({email}).exec();
        if(!foundUser) return res.status(404).json({success: false, message: "User not found"});

        const match = await foundUser.verifyPassword(password);
        if(!match) return res.status(404).json({success: false, message: "Password incorrect"});

        const refreshToken = jwt.sign(
            {email: foundUser.email},
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

        foundUser.refreshToken = refreshToken;
        await foundUser.save();

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

module.exports = { registerUser, authUser, updateUser, deleteUser };