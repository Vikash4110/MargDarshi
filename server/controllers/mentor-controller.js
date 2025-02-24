// const Mentor = require("../models/mentor-model");
// const mongoose = require("mongoose");
// const { GridFSBucket } = require("mongodb");
// const multer = require("multer");
// const mongoURI = process.env.MONGODB_URI;
// const JobPost = require("../models/job-post-model");
// const JobApplication = require("../models/job-application-model");
// const Mentee = require("../models/mentee-model");
// const ConnectionRequest = require("../models/connection-request-model");


// const conn = mongoose.createConnection(mongoURI);

// let gridfsBucket;
// conn.once("open", () => {
//   gridfsBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
//   console.log("GridFS Bucket Ready in mentor-controller");
// });

// // Multer configuration (single file)
// const imageUpload = multer({
//   storage: multer.memoryStorage(),
// }).single("profilePicture"); // Accepts only one file

// const register = async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       password,
//       phoneNumber,
//       jobTitle,
//       industry,
//       yearsOfExperience,
//       company,
//       linkedInUrl,
//       skills,
//       mentorshipTopics,
//       bio,
//     } = req.body;
//     console.log("Raw req.body:", req.body); // Debugging log

//     let profilePicture = "";

//     // Process profilePicture (only one image allowed)
//     if (req.file) {
//       const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
//         contentType: req.file.mimetype,
//       });

//       uploadStream.end(req.file.buffer);
//       await new Promise((resolve, reject) => {
//         uploadStream.on("finish", () => {
//           profilePicture = uploadStream.id; // Store only one image ID
//           resolve();
//         });
//         uploadStream.on("error", reject);
//       });
//     }

//     // Check if user already exists
//     const userExist = await Mentor.findOne({ email });
//     if (userExist) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Create a new mentor
//     const newUser = new Mentor({
//       fullName,
//       email,
//       password,
//       phoneNumber,
//       jobTitle,
//       industry,
//       yearsOfExperience,
//       company,
//       linkedInUrl,
//       skills,
//       mentorshipTopics,
//       bio,
//       profilePicture,
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

// controllers/mentor-controller.js
const Mentor = require("../models/mentor-model");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const multer = require("multer");
const mongoURI = process.env.MONGODB_URI;
const JobPost = require("../models/job-post-model");
const JobApplication = require("../models/job-application-model");
const Mentee = require("../models/mentee-model");
const ConnectionRequest = require("../models/connection-request-model");

const conn = mongoose.createConnection(mongoURI);

let gridfsBucket;
conn.once("open", () => {
  gridfsBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
  console.log("GridFS Bucket Ready in mentor-controller");
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
      jobTitle,
      industry,
      yearsOfExperience,
      company,
      linkedInUrl,
      skills,
      mentorshipTopics,
      bio,
    } = req.body;

    let profilePicture = "";

    if (req.file) {
      const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });

      uploadStream.end(req.file.buffer);
      await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => {
          profilePicture = uploadStream.id;
          resolve();
        });
        uploadStream.on("error", reject);
      });
    }

    const userExist = await Mentor.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new Mentor({
      fullName,
      email,
      password,
      phoneNumber,
      jobTitle,
      industry,
      yearsOfExperience: Number(yearsOfExperience), // Ensure it's a number
      company,
      linkedInUrl,
      skills,
      mentorshipTopics,
      bio,
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

    const request = await ConnectionRequest.findById(requestId).populate("menteeId");
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.mentorId.toString() !== mentorId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      const mentee = await Mentee.findById(request.menteeId);
      if (!mentee) {
        return res.status(404).json({ message: "Mentee not found" });
      }
      if (!mentee.connectedMentors.includes(mentorId)) {
        mentee.connectedMentors.push(mentorId);
        await mentee.save();
      }

      const mentor = await Mentor.findById(mentorId);
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      if (!mentor.connectedMentees.includes(request.menteeId)) {
        mentor.connectedMentees.push(request.menteeId);
        await mentor.save();
      }
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
    }).populate({
      path: "menteeId",
      select: "fullName email phoneNumber currentEducationLevel universityName fieldOfStudy",
    });

    // Filter out requests with invalid or missing menteeId
    const validRequests = pendingRequests.filter(
      (request) => request.menteeId !== null && request.menteeId !== undefined
    );

    res.status(200).json({ pendingRequests: validRequests });
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Ensure getConnectedMentees returns unique mentees
const getConnectedMentees = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const mentor = await Mentor.findById(mentorId).populate(
      "connectedMentees",
      "fullName email phoneNumber currentEducationLevel universityName fieldOfStudy profilePicture"
    );
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    // Remove duplicates from connectedMentees
    const uniqueMentees = Array.from(new Set(mentor.connectedMentees.map(m => m._id.toString())))
      .map(id => mentor.connectedMentees.find(m => m._id.toString() === id));
    res.status(200).json({ connectedMentees: uniqueMentees });
  } catch (err) {
    console.error("Error fetching connected mentees:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



  const updateCalendlyLink = async (req, res) => {
    try {
        const { calendlyLink } = req.body;
        const mentorId = req.user._id;

        // Validate input
        if (!calendlyLink) {
            return res.status(400).json({ message: "Calendly link is required" });
        }

        // Find mentor by ID
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        // Update calendly link
        mentor.calendlyLink = calendlyLink;
        await mentor.save();

        res.status(200).json({
            message: "Calendly link updated successfully",
            updatedMentor: mentor,
        });
    } catch (err) {
        console.error("Error updating Calendly link:", err);
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

// Post a new job
const postJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      requirements,
      jobType,
      salaryRange,
      applicationDeadline,
    } = req.body;
    const mentorId = req.user._id;

    const newJob = new JobPost({
      mentorId,
      title,
      company,
      location,
      description,
      requirements,
      jobType,
      salaryRange,
      applicationDeadline,
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (err) {
    console.error("Error posting job:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all jobs posted by the mentor
const getPostedJobs = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const jobs = await JobPost.find({ mentorId });
    res.status(200).json({ jobs });
  } catch (err) {
    console.error("Error fetching posted jobs:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get applicants for a specific job
const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const mentorId = req.user._id;

    const job = await JobPost.findOne({ _id: jobId, mentorId });
    if (!job) {
      return res.status(404).json({ message: "Job not found or not owned by you" });
    }

    const applicants = await JobApplication.find({ jobId }).populate(
      "menteeId",
      "fullName email phoneNumber currentEducationLevel universityName fieldOfStudy linkedInProfileUrl profilePicture"
    );
    res.status(200).json({ applicants });
  } catch (err) {
    console.error("Error fetching job applicants:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update job status (e.g., close it)
const updateJobStatus = async (req, res) => {
  try {
    const { jobId, status } = req.body;
    const mentorId = req.user._id;

    const job = await JobPost.findOneAndUpdate(
      { _id: jobId, mentorId },
      { status },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found or not owned by you" });
    }

    res.status(200).json({ message: "Job status updated", job });
  } catch (err) {
    console.error("Error updating job status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;
    const mentorId = req.user._id;

    if (!applicationId || !status) {
      return res.status(400).json({ message: "Application ID and status are required" });
    }

    if (!["Pending", "Reviewed", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await JobApplication.findById(applicationId).populate("jobId");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the mentor owns the job
    if (application.jobId.mentorId.toString() !== mentorId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: `Application status updated to ${status}`, application });
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { register, login, mentor, updateUser, respondToConnectionRequest, getAllMentors, getPendingRequests, getConnectedMentees, updateCalendlyLink , imageUpload , getImageById ,postJob,  getPostedJobs, getJobApplicants,updateJobStatus, updateApplicationStatus};


 