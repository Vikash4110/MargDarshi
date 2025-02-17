const Mentee = require("../models/mentee-model");
const { findMatchingMentors } = require("../utils/matchingAlgorithm");
const ConnectionRequest = require("../models/connection-request-model");

const register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            phoneNumber,
            currentEducationLevel,
            universityName,
            fieldOfStudy,
            expectedGraduationYear,
            careerInterests,
            desiredIndustry,
            skillsToDevelop,
            typeOfMentorshipSought,
            preferredDaysAndTimes,
            preferredMentorshipMode,
            personalIntroduction,
            linkedInProfileUrl,
        } = req.body;

        // Check if user already exists
        const userExist = await Mentee.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create a new mentee
        const newUser = new Mentee({
            fullName,
            email,
            password,
            phoneNumber,
            currentEducationLevel,
            universityName,
            fieldOfStudy,
            expectedGraduationYear,
            careerInterests,
            desiredIndustry,
            skillsToDevelop,
            typeOfMentorshipSought,
            preferredDaysAndTimes,
            preferredMentorshipMode,
            personalIntroduction,
            linkedInProfileUrl,
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await Mentee.findOne({ email });

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

const mentee = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.error("Fetching user details error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//Update mentor details (without changing password)
const updateUser = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phoneNumber,
            currentEducationLevel,
            universityName,
            fieldOfStudy,
            expectedGraduationYear,
            careerInterests,
            desiredIndustry,
            skillsToDevelop,
            typeOfMentorshipSought,
            preferredDaysAndTimes,
            preferredMentorshipMode,
            personalIntroduction,
            linkedInProfileUrl,
        } = req.body;

        const menteeId = req.user._id;

        // Find the mentee by ID
        const mentee = await Mentee.findById(menteeId);
        if (!mentee) {
            return res.status(404).json({ message: "Mentee not found" });
        }

        // Update only provided fields
        if (fullName) mentee.fullName = fullName;
        if (email) mentee.email = email;
        if (phoneNumber) mentee.phoneNumber = phoneNumber;
        if (currentEducationLevel) mentee.currentEducationLevel = currentEducationLevel;
        if (universityName) mentee.universityName = universityName;
        if (fieldOfStudy) mentee.fieldOfStudy = fieldOfStudy;
        if (expectedGraduationYear) mentee.expectedGraduationYear = expectedGraduationYear;
        if (careerInterests) mentee.careerInterests = careerInterests;
        if (desiredIndustry) mentee.desiredIndustry = desiredIndustry;
        if (skillsToDevelop) mentee.skillsToDevelop = skillsToDevelop;
        if (typeOfMentorshipSought) mentee.typeOfMentorshipSought = typeOfMentorshipSought;
        if (preferredDaysAndTimes) mentee.preferredDaysAndTimes = preferredDaysAndTimes;
        if (preferredMentorshipMode) mentee.preferredMentorshipMode = preferredMentorshipMode;
        if (personalIntroduction) mentee.personalIntroduction = personalIntroduction;
        if (linkedInProfileUrl) mentee.linkedInProfileUrl = linkedInProfileUrl;

        // Save updated mentee details
        await mentee.save();

        res.status(200).json({
            message: "Profile updated successfully",
            updatedMentee: mentee,
        });
    } catch (err) {
        console.error("Error updating mentee:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getMatchingMentors = async (req, res) => {
    try {
        const menteeId = req.user._id;
        const mentee = await Mentee.findById(menteeId);

        if (!mentee) {
            return res.status(404).json({ message: "Mentee not found" });
        }

        const matchingMentors = await findMatchingMentors(mentee);
        res.status(200).json({ matchingMentors });
    } catch (err) {
        console.error("Error fetching matching mentors:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const sendConnectionRequest = async (req, res) => {
    try {
        const { mentorId } = req.body;
        const menteeId = req.user._id;

        // Check if a request already exists
        const existingRequest = await ConnectionRequest.findOne({
            menteeId,
            mentorId,
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Request already sent" });
        }

        // Create a new connection request
        const newRequest = new ConnectionRequest({
            menteeId,
            mentorId,
            status: "pending",
        });

        await newRequest.save();

        res.status(201).json({ message: "Connection request sent" });
    } catch (err) {
        console.error("Error sending connection request:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getConnectedMentors = async (req, res) => {
    try {
      const menteeId = req.user._id;
      const mentee = await Mentee.findById(menteeId).populate(
        "connectedMentors",
        "fullName email jobTitle industry yearsOfExperience"
      );
  
      if (!mentee) {
        return res.status(404).json({ message: "Mentee not found" });
      }
  
      res.status(200).json({ connectedMentors: mentee.connectedMentors });
    } catch (err) {
      console.error("Error fetching connected mentors:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
module.exports = { register, login, mentee, updateUser, getMatchingMentors, sendConnectionRequest, getConnectedMentors };
