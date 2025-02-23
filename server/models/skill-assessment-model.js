const mongoose = require("mongoose");

const skillAssessmentSchema = new mongoose.Schema({
  menteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentee",
    required: true,
  },
  domain: { 
    type: String, 
    required: true, 
    enum: [
      "Programming", 
      "Data Science", 
      "Web Development", 
      "Machine Learning", 
      "Soft Skills", 
      "Cybersecurity", 
      "Project Management", 
      "Cloud Computing", 
      "DevOps", 
      "UI/UX Design", 
      "Database Management", 
      "Blockchain"
    ] 
  },
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String,
  }],
  responses: [{
    questionIndex: { type: Number, required: true },
    selectedAnswer: { type: String, required: true },
  }],
  score: { type: Number, default: 0 },
  completedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("SkillAssessment", skillAssessmentSchema);