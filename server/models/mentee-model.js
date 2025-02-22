const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mentee Schema
const menteeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    profilePicture: { type: String },
    currentEducationLevel: { type: String, required: false },
    universityName: { type: String, required: false },
    fieldOfStudy: { type: String, required: false },
    expectedGraduationYear: { type: Number, required: false },
    careerInterests: { type: [String], required: false },
    desiredIndustry: { type: [String], required: false },
    skillsToDevelop: { type: [String], required: false },
    typeOfMentorshipSought: { type: [String], required: false },
    preferredDaysAndTimes: { type: [String], required: false },
    preferredMentorshipMode: { type: String, required: false },
    personalIntroduction: { type: String, required: false },
    linkedInProfileUrl: { type: String, required: false },
    connectedMentors: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Mentor",
      },
  ],
  },
  { timestamps: true }
);

// Hash password before saving
menteeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password
menteeSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
menteeSchema.methods.generateToken = async function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
};

// Export model
const Mentee = mongoose.model("Mentee", menteeSchema);
module.exports = Mentee;
