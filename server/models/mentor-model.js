// models/mentor-model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mentorSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phoneNumber: { type: String },
        profilePicture: { type: String },
        jobTitle: { type: String, required: true },
        industry: { type: String, required: true },
        yearsOfExperience: { type: Number, required: true },
        company: { type: String, required: true },
        linkedInUrl: { type: String },
        skills: [{ type: String, required: true }],
        mentorshipTopics: [{ type: String, required: true }],
        bio: { type: String, required: true },
        motivation: { type: String },
        availability: [
            {
                day: { type: String, required: true },
                time: { type: String, required: true },
            },
        ],
        mentorshipMode: { type: String },
        maxMentees: { type: Number },
        socialMedia: {
            twitter: { type: String },
            github: { type: String },
            other: { type: String },
        },
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

// Generate JWT token
mentorSchema.methods.generateToken = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_KEY, {
        expiresIn: "1h",
    });
};

module.exports = mongoose.model("Mentor", mentorSchema);
