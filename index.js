const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = 3500;

//Link router
const userRouter = require('./route/User');

//Link middleware
const verifyToken = require('./middleware/verifyToken');

//Important Middleware
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Connected DB
const DBconnect = async() => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URI);
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1); // dừng server nếu lỗi
    }
};
DBconnect();

//Router
app.use('/api/user', userRouter);

//Verify Middleware
app.use(verifyToken);

app.get('/', (req,res) => {
    return res.send("Hello world");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
