const Mentor = require("../models/mentor-model");
const Mentee = require("../models/mentee-model");
const bcrypt = require("bcryptjs");
const ConnectionRequest = require("../models/connection-request-model");

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
const respondToConnectionRequest = async (req, res) => {
    try {
      const { requestId, status } = req.body;
      const mentorId = req.user._id;
  
      if (!requestId || !status) {
        return res.status(400).json({ message: "Request ID and status are required" });
      }
  
      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
  
      // Find the request
      const request = await ConnectionRequest.findById(requestId).populate(
        "menteeId"
      );
  
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
  
      if (request.mentorId.toString() !== mentorId.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      // Update the request status
      request.status = status;
      await request.save();
  
      if (status === "accepted") {
        // Add mentor to mentee's connectedMentors
        const mentee = await Mentee.findById(request.menteeId);
        if (!mentee) {
          return res.status(404).json({ message: "Mentee not found" });
        }
        mentee.connectedMentors.push(mentorId);
        await mentee.save();
  
        // Add mentee to mentor's connectedMentees
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
          return res.status(404).json({ message: "Mentor not found" });
        }
        mentor.connectedMentees.push(request.menteeId);
        await mentor.save();
      }
  
      res.status(200).json({ message: `Request ${status}` });
    } catch (err) {
      console.error("Error responding to connection request:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

const getAllMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find().select("-password"); // Exclude password for security
        res.status(200).json(mentors);
    } catch (err) {
        console.error("Error fetching mentors:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getPendingRequests = async (req, res) => {
    try {
        const mentorId = req.user._id;

        // Fetch all pending requests for the mentor
        const pendingRequests = await ConnectionRequest.find({
            mentorId,
            status: "pending",
        }).populate("menteeId", "fullName email phoneNumber currentEducationLevel universityName fieldOfStudy");

        res.status(200).json({ pendingRequests });
    } catch (err) {
        console.error("Error fetching pending requests:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getConnectedMentees = async (req, res) => {
    try {
      const mentorId = req.user._id;
  
      // Find the mentor and populate the connectedMentees field
      const mentor = await Mentor.findById(mentorId).populate(
        "connectedMentees",
        "fullName email phoneNumber currentEducationLevel universityName fieldOfStudy"
      );
  
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
  
      res.status(200).json({ connectedMentees: mentor.connectedMentees });
    } catch (err) {
      console.error("Error fetching connected mentees:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

module.exports = { register, login, mentor, updateUser, respondToConnectionRequest, getAllMentors, getPendingRequests, getConnectedMentees };


 