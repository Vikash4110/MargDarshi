const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mentor Schema
const mentorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String, // store file path or URL
    required: false,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  linkedInUrl: {
    type: String,
    required: false,
  },
  skills: [{
    type: String,
    required: true,
  }],
  mentorshipTopics: [{
    type: String,
    required: true,
  }],
  bio: {
    type: String,
    required: true,
  },
  motivation: {
    type: String,
    required: false,
  },
  availability: [{
    day: { type: String, required: true },
    time: { type: String, required: true },
  }],
  mentorshipMode: {
    type: String, // e.g., Video Call, Chat
    required: false,
  },
  maxMentees: {
    type: Number,
    required: false,
  },
  socialMedia: {
    twitter: { type: String, required: false },
    github: { type: String, required: false },
    other: { type: String, required: false },
  }
}, { timestamps: true });

// Hash password before saving user
mentorSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password for login
mentorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
mentorSchema.methods.generateToken = async function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_KEY, { expiresIn: '1h' });
};

// Exporting the Mentor model
const Mentor = mongoose.model('Mentor', mentorSchema);
module.exports = Mentor;
