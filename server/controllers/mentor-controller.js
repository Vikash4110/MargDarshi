const Mentor = require("../models/mentor-model");
const bcrypt = require("bcryptjs");
const register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            phoneNumber,
            jobTitle,
            industry,
            yearsOfExperience,
            company,
            linkedInUrl,
            skills,
            mentorshipTopics,
            bio
        } = req.body;

        // Check if user already exists
        const userExist = await Mentor.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create a new mentor
        const newUser = new Mentor({
            fullName,
            email,
            password,
            phoneNumber,
            jobTitle,
            industry,
            yearsOfExperience,
            company,
            linkedInUrl,
            skills,
            mentorshipTopics,
            bio
        });

        await newUser.save();

        res.status(201).json({
            message: "Registration Successful",
            token: await newUser.generateToken(),
            userId: newUser._id.toString(),
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Mentor login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await Mentor.findOne({ email });

        if (!userExist) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await userExist.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({
            message: "Login Successful",
            token: await userExist.generateToken(),
            userId: userExist._id.toString(),
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Fetch mentor user details
const user = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.error("Fetching user details error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { register, login, user };
