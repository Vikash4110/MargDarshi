const SkillAssessment = require("../models/skill-assessment-model");
const Question = require("../models/question-model");

// Get available domains
const getDomains = async (req, res) => {
  try {
    const domains = await Question.distinct("domain");
    res.status(200).json({ domains });
  } catch (err) {
    console.error("Error fetching domains:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Start a new assessment
const startAssessment = async (req, res) => {
  try {
    const { domain } = req.body;
    const menteeId = req.user._id;

    if (!domain) {
      return res.status(400).json({ message: "Domain is required" });
    }

    const existingAssessment = await SkillAssessment.findOne({
      menteeId,
      domain,
      completedAt: null,
    });

    if (existingAssessment) {
      return res.status(200).json(existingAssessment);
    }

    const questions = await Question.find({ domain }).limit(10); // Fetch 10 random questions
    if (questions.length < 10) {
      return res.status(400).json({ message: "Insufficient questions for this domain" });
    }

    const newAssessment = new SkillAssessment({
      menteeId,
      domain,
      questions: questions.map(q => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    });

    await newAssessment.save();
    res.status(201).json(newAssessment);
  } catch (err) {
    console.error("Error starting assessment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Submit answers and calculate score
const submitAssessment = async (req, res) => {
  try {
    const { assessmentId, responses } = req.body;
    const menteeId = req.user._id;

    const assessment = await SkillAssessment.findOne({ _id: assessmentId, menteeId });
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    if (assessment.completedAt) {
      return res.status(400).json({ message: "Assessment already completed" });
    }

    if (responses.length !== assessment.questions.length) {
      return res.status(400).json({ message: "All questions must be answered" });
    }

    assessment.responses = responses;
    let score = 0;
    assessment.questions.forEach((q, index) => {
      const userAnswer = responses.find(r => r.questionIndex === index)?.selectedAnswer;
      if (userAnswer === q.correctAnswer) score += 1;
    });
    assessment.score = (score / assessment.questions.length) * 100; // Percentage score
    assessment.completedAt = new Date();

    await assessment.save();
    res.status(200).json({
      message: "Assessment submitted successfully",
      score: assessment.score,
    });
  } catch (err) {
    console.error("Error submitting assessment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get mentee's assessment history
const getAssessmentHistory = async (req, res) => {
  try {
    const menteeId = req.user._id;
    const history = await SkillAssessment.find({ menteeId }).sort({ completedAt: -1 });
    res.status(200).json({ history });
  } catch (err) {
    console.error("Error fetching assessment history:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getDomains,
  startAssessment,
  submitAssessment,
  getAssessmentHistory,
};