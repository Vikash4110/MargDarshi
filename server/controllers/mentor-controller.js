

const Mentor = require("../models/mentor-model");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const multer = require("multer");
const mongoURI = process.env.MONGODB_URI;
const JobPost = require("../models/job-post-model");
const JobApplication = require("../models/job-application-model");
const Mentee = require("../models/mentee-model");
const ConnectionRequest = require("../models/connection-request-model");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

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

// Register with OTP initiation
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
          profilePicture = uploadStream.id.toString();
          resolve();
        });
        uploadStream.on("error", reject);
      });
    }

    const userExist = await Mentor.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = generateOTP();
    await sendOTPEmail(email, otp);
    otpStore.set(email, { otp, data: { ...req.body, profilePicture }, expires: Date.now() + 10 * 60 * 1000 });

    res.status(200).json({ message: "OTP sent to your email. Please verify." });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Verify OTP and complete registration
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
      jobTitle,
      industry,
      yearsOfExperience,
      company,
      linkedInUrl,
      skills,
      mentorshipTopics,
      bio,
      profilePicture,
    } = stored.data;

    const newUser = new Mentor({
      fullName,
      email,
      password,
      phoneNumber,
      jobTitle,
      industry,
      yearsOfExperience: Number(yearsOfExperience),
      company,
      linkedInUrl,
      skills,
      mentorshipTopics,
      bio,
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

// Send OTP for Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
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

// Reset Password with OTP
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    mentor.password = newPassword;
    await mentor.save();
    otpStore.delete(email);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
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

// Function to send video call notification email
const sendVideoCallEmail = async (menteeId, mentorId) => {
  try {
    const mentee = await Mentee.findById(menteeId);
    const mentor = await Mentor.findById(mentorId);

    if (!mentee || !mentor) {
      throw new Error("Mentee or Mentor not found");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mentee.email,
      subject: "Video Call Scheduled - Join Now!",
      html: `
        <p>Hello ${mentee.fullName},</p>
        <p>Your mentor, ${mentor.fullName}, has scheduled a video call with you.</p>
        <p>Please join the meeting now by logging into MargDarshi and clicking the "Video Call" button in your connected mentors list.</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
        <p>Best regards,<br/>The MargDarshi Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Video call email sent to ${mentee.email}`);
  } catch (error) {
    console.error("Error sending video call email:", error);
    throw error;
  }
};

// New route handler for scheduling video call and sending email
const scheduleVideoCall = async (req, res) => {
  try {
    const { menteeId } = req.body;
    const mentorId = req.user._id;

    await sendVideoCallEmail(menteeId, mentorId);
    res.status(200).json({ message: "Video call scheduled and email sent successfully" });
  } catch (err) {
    console.error("Error scheduling video call:", err);
    res.status(500).json({ message: "Failed to schedule video call", error: err.message });
  }
};

// Update availability
const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body; // Array of { day, timeSlots: [{ startTime, endTime }] }
    const mentorId = req.user._id;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    mentor.availability = availability;
    await mentor.save();

    res.status(200).json({ message: "Availability updated successfully", availability: mentor.availability });
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Schedule a meeting
const scheduleMeeting = async (req, res) => {
  try {
    const { menteeId, date, startTime, endTime } = req.body;
    const mentorId = req.user._id;

    const mentor = await Mentor.findById(mentorId);
    const mentee = await Mentee.findById(menteeId);
    if (!mentor || !mentee) return res.status(404).json({ message: "Mentor or Mentee not found" });

    // Check if slot is available
    const dayOfWeek = new Date(date).toLocaleString("en-US", { weekday: "long" });
    const availableDay = mentor.availability.find((a) => a.day === dayOfWeek);
    if (!availableDay || !availableDay.timeSlots.some((slot) => slot.startTime === startTime && slot.endTime === endTime)) {
      return res.status(400).json({ message: "Selected time slot is not available" });
    }

    // Check for conflicts
    const conflict = mentor.meetings.some(
      (m) => m.date.toISOString().split("T")[0] === date && m.startTime === startTime
    );
    if (conflict) return res.status(400).json({ message: "Time slot already booked" });

    const meetingLink = `${backendUrl}/meeting/${mentorId}-${menteeId}-${Date.now()}`; // Placeholder, integrate ZegoCloud link later
    const meeting = { menteeId, date: new Date(date), startTime, endTime, meetingLink };

    mentor.meetings.push(meeting);
    mentee.connectedMentors = mentee.connectedMentors || [];
    if (!mentee.connectedMentors.includes(mentorId)) mentee.connectedMentors.push(mentorId);

    await Promise.all([mentor.save(), mentee.save()]);
    await sendMeetingEmail(mentor, mentee, meeting);

    res.status(201).json({ message: "Meeting scheduled successfully", meeting });
  } catch (err) {
    console.error("Error scheduling meeting:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Send meeting confirmation email
const sendMeetingEmail = async (mentor, mentee, meeting) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: [mentor.email, mentee.email],
    subject: "Meeting Scheduled - MargDarshi",
    html: `
      <p>Hello ${mentor.fullName} and ${mentee.fullName},</p>
      <p>A meeting has been scheduled:</p>
      <ul>
        <li><strong>Date:</strong> ${new Date(meeting.date).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${meeting.startTime} - ${meeting.endTime}</li>
        <li><strong>Link:</strong> <a href="${meeting.meetingLink}">${meeting.meetingLink}</a></li>
      </ul>
      <p>Please join the meeting at the scheduled time.</p>
      <p>Best regards,<br/>The MargDarshi Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

// Get mentor's availability and meetings
const getMentorSchedule = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const mentor = await Mentor.findById(mentorId).select("availability meetings");
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    res.status(200).json({ availability: mentor.availability, meetings: mentor.meetings });
  } catch (err) {
    console.error("Error fetching schedule:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMentorInsights = async (req, res) => {
  try {
    const mentorId = req.user._id;

    // 1. Pending Requests Over Time (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const pendingRequests = await ConnectionRequest.aggregate([
      { $match: { mentorId, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Connected Mentees Growth (monthly)
    const menteesGrowth = await Mentor.aggregate([
      { $match: { _id: mentorId } },
      { $unwind: "$connectedMentees" },
      {
        $lookup: {
          from: "mentees",
          localField: "connectedMentees",
          foreignField: "_id",
          as: "menteeData",
        },
      },
      { $unwind: "$menteeData" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$menteeData.updatedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. Response Rate
    const responseStats = await ConnectionRequest.aggregate([
      { $match: { mentorId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const totalResponses = responseStats.reduce((sum, stat) => sum + stat.count, 0);
    const accepted = responseStats.find((s) => s._id === "accepted")?.count || 0;
    const responseRate = totalResponses ? (accepted / totalResponses) * 100 : 0;

    // 4. Job Engagement
    const jobEngagement = await JobPost.aggregate([
      { $match: { mentorId } },
      {
        $lookup: {
          from: "jobapplications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        },
      },
      {
        $project: {
          title: 1,
          applicationCount: { $size: "$applications" },
        },
      },
    ]);

    res.status(200).json({
      pendingRequests,
      menteesGrowth,
      responseRate: responseRate.toFixed(1),
      jobEngagement,
    });
  } catch (err) {
    console.error("Error fetching mentor insights:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { register, verifyOTP,
  forgotPassword,
  resetPassword, login, mentor, updateUser, respondToConnectionRequest, getAllMentors, getPendingRequests, getConnectedMentees, updateCalendlyLink , imageUpload , getImageById ,postJob,  getPostedJobs, getJobApplicants,updateJobStatus, updateApplicationStatus , scheduleVideoCall,
  updateAvailability, scheduleMeeting, getMentorSchedule,getMentorInsights};


 