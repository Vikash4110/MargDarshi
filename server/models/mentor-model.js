const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mentorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    profilePicture: { type: String },
    jobTitle: { type: String, required: true },
    industry: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    company: { type: String, required: true },
    linkedInUrl: { type: String },
    skills: [{ type: String, required: true }],
    mentorshipTopics: [{ type: String, required: true }],
    bio: { type: String },
    motivation: { type: String },
    availability: [
      {
        day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
        timeSlots: [{ startTime: String, endTime: String }], // e.g., "09:00-10:00"
      },
    ],
    meetings: [
      {
        menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentee" },
        date: { type: Date },
        startTime: { type: String },
        endTime: { type: String },
        meetingLink: { type: String },
        status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
      },
    ],
    // availability: [
    //   {
    //     day: { type: String },
    //     time: { type: String },
    //   },
    // ],
    mentorshipMode: { type: String },
    maxMentees: { type: Number },
    socialMedia: {
      twitter: { type: String },
      github: { type: String },
      other: { type: String },
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    calendlyLink: { type: String, default: "" },
    connectedMentees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentee",
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
mentorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password for login
mentorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token with 24-hour expiration
mentorSchema.methods.generateToken = function () {
  return jwt.sign({ userId: this._id, role: "mentor" }, process.env.JWT_KEY, {
    expiresIn: "24h", // Extended to 24 hours
  });
};

const Mentor = mongoose.model("Mentor", mentorSchema);
module.exports = Mentor;