const Mentee = require("../models/mentee-model");

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

module.exports = { register, login, mentee };
