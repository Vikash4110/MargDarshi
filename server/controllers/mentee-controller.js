const Mentee = require("../models/mentee-model");
const { findMatchingMentors } = require("../utils/matchingAlgorithm");
const ConnectionRequest = require("../models/connection-request-model");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const multer = require("multer");
const mongoURI = process.env.MONGODB_URI;


const conn = mongoose.createConnection(mongoURI);

let gridfsBucket;
conn.once("open", () => {
  gridfsBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
  console.log("GridFS Bucket Ready in mentee-controller");
});

// Multer configuration (single file)
const imageUpload = multer({
  storage: multer.memoryStorage(),
}).single("profilePicture"); // Accepts only one file

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

        let profilePicture = "";

        // Process profilePicture (only one image allowed)
        if (req.file) {
            const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
                contentType: req.file.mimetype,
            });

            uploadStream.end(req.file.buffer);
            await new Promise((resolve, reject) => {
                uploadStream.on("finish", () => {
                    profilePicture = uploadStream.id; // Store only one image ID
                    resolve();
                });
                uploadStream.on("error", reject);
            });
        }

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
            profilePicture,
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
        "fullName email jobTitle industry yearsOfExperience calendlyLink profilePicture" // Include calendlyLink
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


  const getSentRequests = async (req, res) => {
    try {
        const menteeId = req.user._id;

        // Fetch all connection requests sent by the mentee
        const sentRequests = await ConnectionRequest.find({ menteeId }).populate(
            "mentorId",
            "fullName email jobTitle industry yearsOfExperience calendlyLink profilePicture"
        );

        res.status(200).json({ sentRequests });
    } catch (err) {
        console.error("Error fetching sent requests:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const withdrawRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const menteeId = req.user._id;

        // Find and delete the connection request
        const deletedRequest = await ConnectionRequest.findOneAndDelete({
            _id: requestId,
            menteeId,
        });

        if (!deletedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({ message: "Request withdrawn successfully" });
    } catch (err) {
        console.error("Error withdrawing request:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Route to fetch images by their ID
const getImageById = async (req, res) => {
    try {
        const { id } = req.params;
  
        if (!id) {
            return res.status(400).json({ message: "Image ID is required" });
        }
  
        const objectId = new mongoose.Types.ObjectId(id); // Correctly use mongoose.Types.ObjectId
        const file = await conn.db.collection("uploads.files").findOne({ _id: objectId });
        if (!file) {
            return res.status(404).json({ message: "Image not found" });
        }
  
        const readStream = gridfsBucket.openDownloadStream(objectId);
        res.set("Content-Type", file.contentType);
        readStream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };


module.exports = { register, login, mentee, updateUser, getMatchingMentors, sendConnectionRequest, getConnectedMentors, getSentRequests ,withdrawRequest , getImageById, imageUpload };

