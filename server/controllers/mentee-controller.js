// const Mentee = require("../models/mentee-model");
// const Mentor = require("../models/mentor-model");
// const ConnectionRequest = require("../models/connection-request-model");
// const { findMatchingMentors } = require("../utils/matchingAlgorithm");
// const mongoose = require("mongoose");
// const { GridFSBucket } = require("mongodb");
// const multer = require("multer");
// const mongoURI = process.env.MONGODB_URI;
// const JobPost = require("../models/job-post-model");
// const JobApplication = require("../models/job-application-model");
// const nodemailer = require("nodemailer");

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

// // Email transporter setup (configure with your SMTP service, e.g., Gmail)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // Your email address (set in .env)
//     pass: process.env.EMAIL_PASS, // Your email password or app-specific password (set in .env)
//   },
// });

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
//           profilePicture = uploadStream.id.toString();
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
//       careerInterests: careerInterests || [],
//       desiredIndustry: desiredIndustry || [],
//       skillsToDevelop: skillsToDevelop || [],
//       typeOfMentorshipSought: typeOfMentorshipSought || [],
//       preferredDaysAndTimes: preferredDaysAndTimes || [],
//       preferredMentorshipMode,
//       personalIntroduction,
//       linkedInProfileUrl,
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
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
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
const nodemailer = require("nodemailer");

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

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "MargDarshi - Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #0f6f5c; text-align: center;">Welcome to MargDarshi!</h2>
        <p style="color: #333; font-size: 16px;">Please use the OTP below to verify your email address:</p>
        <h3 style="color: #0f6f5c; text-align: center; font-size: 24px; margin: 20px 0;">${otp}</h3>
        <p style="color: #666; font-size: 14px; text-align: center;">This OTP is valid for 10 minutes.</p>
        <p style="color: #666; font-size: 14px; text-align: center;">If you didn’t request this, please ignore this email.</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
  console.log(`OTP sent to ${email}`);
};

// Store OTPs temporarily (in-memory for simplicity, use Redis/MongoDB in production)
const otpStore = new Map();

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

    const otp = generateOTP();
    await sendOTPEmail(email, otp);
    otpStore.set(email, {
      otp,
      data: {
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
        profilePicture,
      },
      expires: Date.now() + 10 * 60 * 1000,
    });

    res.status(200).json({ message: "OTP sent to your email. Please verify." });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const {
      fullName,
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
      profilePicture,
    } = stored.data;

    const newUser = new Mentee({
      fullName,
      email,
      password,
      phoneNumber,
      currentEducationLevel,
      universityName,
      fieldOfStudy,
      expectedGraduationYear,
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
    otpStore.delete(email);

    res.status(201).json({
      message: "Registration Successful",
      token: await newUser.generateToken(),
      userId: newUser._id.toString(),
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const mentee = await Mentee.findOne({ email });
    if (!mentee) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const otp = generateOTP();
    await sendOTPEmail(email, otp);
    otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

    res.status(200).json({ message: "OTP sent to your email for password reset." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const mentee = await Mentee.findOne({ email });
    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }

    mentee.password = newPassword;
    await mentee.save();
    otpStore.delete(email);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
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

// Function to send video call notification email to mentor
const sendVideoCallEmailToMentor = async (mentorId, menteeId) => {
  try {
    const mentor = await Mentor.findById(mentorId);
    const mentee = await Mentee.findById(menteeId);

    if (!mentor || !mentee) {
      throw new Error("Mentor or Mentee not found");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mentor.email,
      subject: "Video Call Scheduled - Join Now!",
      html: `
        <p>Hello ${mentor.fullName},</p>
        <p>Your mentee, ${mentee.fullName}, has scheduled a video call with you.</p>
        <p>Please join the meeting now by logging into MargDarshi and clicking the "Video Call" button in your connected mentees list.</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
        <p>Best regards,<br/>The MargDarshi Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Video call email sent to ${mentor.email}`);
  } catch (error) {
    console.error("Error sending video call email to mentor:", error);
    throw error;
  }
};

// New route handler for scheduling video call and sending email
const scheduleVideoCall = async (req, res) => {
  try {
    const { mentorId } = req.body;
    const menteeId = req.user._id;

    await sendVideoCallEmailToMentor(mentorId, menteeId);
    res.status(200).json({ message: "Video call scheduled and email sent successfully" });
  } catch (err) {
    console.error("Error scheduling video call:", err);
    res.status(500).json({ message: "Failed to schedule video call", error: err.message });
  }
};

module.exports = {
  register,
  verifyOTP,
  forgotPassword,
  resetPassword,
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
  scheduleVideoCall,
};