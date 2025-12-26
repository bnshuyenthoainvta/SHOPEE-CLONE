const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = 3500;

//Link router
const userRouter = require('./route/User');
const categoryRouter = require("./route/Category");
const productRouter = require("./route/Product");
const cartRouter = require("./route/Cart");
const orderRouter = require("./route/Order");

//Link middleware
const verifyToken = require('./middleware/verifyToken');

//Important Middleware
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//Connected mongoose DB
const DBconnect = async() => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log(`Connect to mongoDB successfully`);
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1); // dừng server nếu lỗi
    }
};
DBconnect();

//User router
app.use('/api/user', userRouter);

//Verify Middleware
app.use(verifyToken);

//Main router
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Start running server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
