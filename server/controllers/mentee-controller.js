// const Mentee = require("../models/mentee-model");
// const Mentor = require("../models/mentor-model"); // Added missing import
// const ConnectionRequest = require("../models/connection-request-model");
// const { findMatchingMentors } = require("../utils/matchingAlgorithm");
// const mongoose = require("mongoose");
// const { GridFSBucket } = require("mongodb");
// const multer = require("multer");
// const mongoURI = process.env.MONGODB_URI;
// const JobPost = require("../models/job-post-model");
// const JobApplication = require("../models/job-application-model");
// const conn = mongoose.createConnection(mongoURI);
// let gridfsBucket;
// conn.once("open", () => {
//   gridfsBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
//   console.log("GridFS Bucket Ready in mentee-controller");
// });

// // Multer configuration (single file)
// const imageUpload = multer({
//   storage: multer.memoryStorage(),
// }).single("profilePicture");

// const register = async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       password,
//       phoneNumber,
//       currentEducationLevel,
//       universityName,
//       fieldOfStudy,
//       expectedGraduationYear,
//       careerInterests,
//       desiredIndustry,
//       skillsToDevelop,
//       typeOfMentorshipSought,
//       preferredDaysAndTimes,
//       preferredMentorshipMode,
//       personalIntroduction,
//       linkedInProfileUrl,
//     } = req.body;

//     let profilePicture = "";
//     if (req.file) {
//       const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
//         contentType: req.file.mimetype,
//       });
//       uploadStream.end(req.file.buffer);
//       await new Promise((resolve, reject) => {
//         uploadStream.on("finish", () => {
//           profilePicture = uploadStream.id;
//           resolve();
//         });
//         uploadStream.on("error", reject);
//       });
//     }

//     const userExist = await Mentee.findOne({ email });
//     if (userExist) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const newUser = new Mentee({
//       fullName,
//       email,
//       password,
//       phoneNumber,
//       currentEducationLevel,
//       universityName,
//       fieldOfStudy,
//       expectedGraduationYear,
//       careerInterests,
//       desiredIndustry,
//       skillsToDevelop,
//       profilePicture,
//       typeOfMentorshipSought,
//       preferredDaysAndTimes,
//       preferredMentorshipMode,
//       personalIntroduction,
//       linkedInProfileUrl,
//     });

//     await newUser.save();

//     res.status(201).json({
//       message: "Registration Successful",
//       token: await newUser.generateToken(),
//       userId: newUser._id.toString(),
//     });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const Mentee = require("../models/mentee-model");
const Mentor = require("../models/mentor-model");
const ConnectionRequest = require("../models/connection-request-model");
const { findMatchingMentors } = require("../utils/matchingAlgorithm");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const multer = require("multer");
const mongoURI = process.env.MONGODB_URI;
const JobPost = require("../models/job-post-model");
const JobApplication = require("../models/job-application-model");

const conn = mongoose.createConnection(mongoURI);
let gridfsBucket;
conn.once("open", () => {
  gridfsBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
  console.log("GridFS Bucket Ready in mentee-controller");
});

// Multer configuration (single file)
const imageUpload = multer({
  storage: multer.memoryStorage(),
}).single("profilePicture");

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
    if (req.file) {
      const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });
      uploadStream.end(req.file.buffer);
      await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => {
          profilePicture = uploadStream.id.toString();
          resolve();
        });
        uploadStream.on("error", reject);
      });
    }

    const userExist = await Mentee.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new Mentee({
      fullName,
      email,
      password,
      phoneNumber,
      currentEducationLevel,
      universityName,
      fieldOfStudy,
      expectedGraduationYear, // Already converted to number by middleware
      careerInterests: careerInterests || [],
      desiredIndustry: desiredIndustry || [],
      skillsToDevelop: skillsToDevelop || [],
      typeOfMentorshipSought: typeOfMentorshipSought || [],
      preferredDaysAndTimes: preferredDaysAndTimes || [],
      preferredMentorshipMode,
      personalIntroduction,
      linkedInProfileUrl,
      profilePicture,
    });

    await newUser.save();

    res.status(201).json({
      message: "Registration Successful",
      token: await newUser.generateToken(),
      userId: newUser._id.toString(),
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
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
    const mentee = await Mentee.findById(menteeId);
    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }

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

    if (!mentorId) {
      return res.status(400).json({ message: "Mentor ID is required" });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      menteeId,
      mentorId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

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
        "fullName email jobTitle industry yearsOfExperience calendlyLink profilePicture"
      );
  
      if (!mentee) {
        return res.status(404).json({ message: "Mentee not found" });
      }
  
      // Ensure uniqueness by converting to Set and back to array
      const uniqueConnectedMentors = Array.from(new Set(mentee.connectedMentors.map(m => m._id.toString())))
        .map(id => mentee.connectedMentors.find(m => m._id.toString() === id));
  
      res.status(200).json({ connectedMentors: uniqueConnectedMentors });
    } catch (err) {
      console.error("Error fetching connected mentors:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


const getSentRequests = async (req, res) => {
  try {
    const menteeId = req.user._id;
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

const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Image ID is required" });
    }

    const objectId = new mongoose.Types.ObjectId(id);
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

// Get all available job posts
const getAllJobs = async (req, res) => {
    try {
      const jobs = await JobPost.find({ status: "Open" }).populate(
        "mentorId",
        "fullName jobTitle company"
      );
      res.status(200).json({ jobs });
    } catch (err) {
      console.error("Error fetching jobs:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Apply to a job
  const applyToJob = async (req, res) => {
    try {
      const { jobId, resumeUrl, coverLetter } = req.body;
      const menteeId = req.user._id;
  
      const job = await JobPost.findById(jobId);
      if (!job || job.status !== "Open") {
        return res.status(404).json({ message: "Job not found or closed" });
      }
  
      const existingApplication = await JobApplication.findOne({ jobId, menteeId });
      if (existingApplication) {
        return res.status(400).json({ message: "You have already applied to this job" });
      }
  
      const application = new JobApplication({
        jobId,
        menteeId,
        resumeUrl,
        coverLetter,
      });
  
      await application.save();
      res.status(201).json({ message: "Application submitted successfully" });
    } catch (err) {
      console.error("Error applying to job:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Get mentee's job applications
  const getMyApplications = async (req, res) => {
    try {
      const menteeId = req.user._id;
      const applications = await JobApplication.find({ menteeId }).populate(
        "jobId",
        "title company location jobType"
      );
      res.status(200).json({ applications });
    } catch (err) {
      console.error("Error fetching applications:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

module.exports = {
  register,
  login,
  mentee,
  updateUser,
  getMatchingMentors,
  sendConnectionRequest,
  getConnectedMentors,
  getSentRequests,
  withdrawRequest,
  getImageById,
  imageUpload,
  getAllJobs,       
  applyToJob,       
  getMyApplications,
};