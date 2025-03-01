// controllers/admin-controller.js
const Mentor = require("../models/mentor-model");
const Mentee = require("../models/mentee-model");
const Admin = require("../models/admin-model");

// Register Admin (for initial setup or admin management)
const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const newAdmin = new Admin({ fullName, email, password });
    await newAdmin.save();

    res.status(201).json({
      message: "Admin registered successfully",
      token: await newAdmin.generateToken(),
      userId: newAdmin._id.toString(),
    });
  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Admin login successful",
      token: await admin.generateToken(),
      userId: admin._id.toString(),
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all mentors
const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().select("-password");
    res.status(200).json({ mentors });
  } catch (err) {
    console.error("Error fetching mentors:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all mentees
const getAllMentees = async (req, res) => {
  try {
    const mentees = await Mentee.find().select("-password");
    res.status(200).json({ mentees });
  } catch (err) {
    console.error("Error fetching mentees:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit mentor
const editMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const mentor = await Mentor.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json({ message: "Mentor updated successfully", mentor });
  } catch (err) {
    console.error("Error updating mentor:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit mentee
const editMentee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const mentee = await Mentee.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }
    res.status(200).json({ message: "Mentee updated successfully", mentee });
  } catch (err) {
    console.error("Error updating mentee:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete mentor
const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const mentor = await Mentor.findByIdAndDelete(id);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json({ message: "Mentor deleted successfully" });
  } catch (err) {
    console.error("Error deleting mentor:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete mentee
const deleteMentee = async (req, res) => {
  try {
    const { id } = req.params;
    const mentee = await Mentee.findByIdAndDelete(id);
    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }
    res.status(200).json({ message: "Mentee deleted successfully" });
  } catch (err) {
    console.error("Error deleting mentee:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllMentors,
  getAllMentees,
  editMentor,
  editMentee,
  deleteMentor,
  deleteMentee,
};