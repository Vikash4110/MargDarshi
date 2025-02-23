const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  domain: { 
    type: String, 
    required: true, 
    enum: ["Programming", "Data Science", "Web Development", "Machine Learning", "Soft Skills", "Cybersecurity", "Project Management","Cloud Computing", 
    "DevOps", 
    "UI/UX Design", 
    "Database Management", 
    "Blockchain"] 
  },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);