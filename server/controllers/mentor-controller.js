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

// Fetch mentee user details
const mentor = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.error("Fetching user details error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update mentor details (without changing password)
const updateUser = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, jobTitle, industry, yearsOfExperience, company, linkedInUrl, skills, mentorshipTopics, bio } = req.body;
        const mentorId = req.user._id;

        // Find the mentor by ID
        const mentor = await Mentor.findById(mentorId);

        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        // Update mentor details
        mentor.fullName = fullName || mentor.fullName;
        mentor.email = email || mentor.email;
        mentor.phoneNumber = phoneNumber || mentor.phoneNumber;
        mentor.jobTitle = jobTitle || mentor.jobTitle;
        mentor.industry = industry || mentor.industry;
        mentor.yearsOfExperience = yearsOfExperience || mentor.yearsOfExperience;
        mentor.company = company || mentor.company;
        mentor.linkedInUrl = linkedInUrl || mentor.linkedInUrl;
        mentor.skills = skills || mentor.skills;
        mentor.mentorshipTopics = mentorshipTopics || mentor.mentorshipTopics;
        mentor.bio = bio || mentor.bio;

        // Save updated mentor details
        await mentor.save();

        res.status(200).json({
            message: "Profile updated successfully",
            updatedMentor: mentor,
        });
    } catch (err) {
        console.error("Error updating mentor:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { register, login, mentor, updateUser };
