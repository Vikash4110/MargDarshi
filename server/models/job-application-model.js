const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPost",
    required: true,
  },
  menteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentee",
    required: true,
  },
  resumeUrl: { // Assuming mentees upload a resume or link it
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
    default: "Pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("JobApplication", jobApplicationSchema);