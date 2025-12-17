const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

// Address schema
const addressSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  ward: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

// User schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      // required: true,
      trim: true,
    },
    avatar: String,
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer"
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    addresses: [addressSchema],
  },
  {
    timestamps: true,
  }
);

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
// userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);