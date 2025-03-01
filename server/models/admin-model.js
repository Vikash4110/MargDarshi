// models/admin-model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password for login
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token with admin role
adminSchema.methods.generateToken = function () {
  return jwt.sign({ userId: this._id, role: "admin" }, process.env.JWT_KEY, {
    expiresIn: "24h",
  });
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;