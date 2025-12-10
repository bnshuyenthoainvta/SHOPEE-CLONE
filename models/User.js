const mongoose = require('mongoose');
const schema = mongoose.Schema;
const argon2 = require('argon2');

const userSchema = schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Provide valid email"],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        enum: ["admin", "seller", "buyer"],
        default: "buyer",
        require: true
    },
    money: {
        type: Number,
        default: 0,
        require: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    }
}, { timestamps: true });

//tackle password before save
userSchema.pre('save', async function (next) {
    if(!this.isModified("password")) return next();
    
    try {
        this.password = await argon2.hash(this.password);
        next();
    } catch (err) {
        next(err);
    }
});

//Method compare password
userSchema.methods.verifyPassword = async function (inputPassword) {
    return await argon2.verify(this.password, inputPassword);
};

//Optional index
userSchema.index({createdAt: -1});

module.exports = mongoose.model('Users', userSchema);