const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 3500;

//Important Middleware
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

//Route
app.get('/', (req,res) => {
    res.send('Hello world');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
