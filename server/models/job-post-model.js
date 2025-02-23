const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [{
    type: String,
    required: true,
  }],
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Freelance"],
    required: true,
  },
  salaryRange: {
    type: String, // e.g., "$50,000 - $70,000" or "Negotiable"
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "Closed"],
    default: "Open",
  },
}, { timestamps: true });

module.exports = mongoose.model("JobPost", jobPostSchema);