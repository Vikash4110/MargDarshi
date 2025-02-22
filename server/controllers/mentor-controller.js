const Mentor = require("../models/mentor-model");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const multer = require("multer");
const mongoURI = process.env.MONGODB_URI;

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
}).single("profilePicture"); // Accepts only one file

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
    console.log("Raw req.body:", req.body); // Debugging log

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
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// const Mentor = require("../models/mentor-model");
// const Mentee = require("../models/mentee-model");
// const ConnectionRequest = require("../models/connection-request-model");


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
//       bio
//     } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ message: "Profile picture is required" });
//     }

//     const userExist = await Mentor.findOne({ email });
//     if (userExist) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Upload file to GridFS
//     const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
//       metadata: {
//         contentType: req.file.mimetype,
//       },
//     });

//     uploadStream.end(req.file.buffer);

//     uploadStream.on('finish', async () => {
//       const newUser = new Mentor({
//         fullName,
//         email,
//         password,
//         phoneNumber,
//         jobTitle,
//         industry,
//         profilePicture: uploadStream.id, // Save the file ID
//         yearsOfExperience,
//         company,
//         linkedInUrl,
//         skills,
//         mentorshipTopics,
//         bio
//       });

//       await newUser.save();

//       res.status(201).json({
//         message: "Registration Successful",
//         token: await newUser.generateToken(),
//         userId: newUser._id.toString(),
//       });
//     });

//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const register = async (req, res) => {
//   try {
//       const {
//           fullName,
//           email,
//           password,
//           phoneNumber,
//           jobTitle,
//           industry,
//           yearsOfExperience,
//           company,
//           linkedInUrl,
//           skills,
//           mentorshipTopics,
//           bio
//       } = req.body;

//       // Check if user already exists
//       const userExist = await Mentor.findOne({ email });
//       if (userExist) {
//           return res.status(400).json({ message: "Email already exists" });
//       }

//       // Create a new mentor
//       const newUser = new Mentor({
//           fullName,
//           email,
//           password,
//           phoneNumber,
//           jobTitle,
//           industry,
//           yearsOfExperience,
//           company,
//           linkedInUrl,
//           skills,
//           mentorshipTopics,
//           bio
//       });

//       await newUser.save();

//       res.status(201).json({
//           message: "Registration Successful",
//           token: await newUser.generateToken(),
//           userId: newUser._id.toString(),
//       });
//   } catch (err) {
//       console.error("Registration error:", err);
//       res.status(500).json({ message: "Internal Server Error" });
//   }
// };


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

// const getPendingRequests = async (req, res) => {
//     try {
//         const mentorId = req.user._id;

//         // Fetch all pending requests for the mentor
//         const pendingRequests = await ConnectionRequest.find({
//             mentorId,
//             status: "pending",
//         }).populate("menteeId", "fullName email phoneNumber currentEducationLevel universityName fieldOfStudy");

//         res.status(200).json({ pendingRequests });
//     } catch (err) {
//         console.error("Error fetching pending requests:", err);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

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

const getConnectedMentees = async (req, res) => {
    try {
      const mentorId = req.user._id;
  
      // Find the mentor and populate the connectedMentees field
      const mentor = await Mentor.findById(mentorId).populate(
        "connectedMentees",
        "fullName email phoneNumber currentEducationLevel universityName fieldOfStudy profilePicture"
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




module.exports = { register, login, mentor, updateUser, respondToConnectionRequest, getAllMentors, getPendingRequests, getConnectedMentees, updateCalendlyLink , imageUpload , getImageById };


 