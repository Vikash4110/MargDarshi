const express = require("express");
const router = express.Router();
const menteeControllers = require("../controllers/mentee-controller");
const { MenteeSignupSchema, MenteeLoginSchema } = require("../validators/mentee-validator");
const validate = require("../middlewares/validate-middleware");
const menteeMiddleware = require("../middlewares/mentee-middleware");
const skillAssessmentControllers = require("../controllers/skill-assessment-controller");
const blogControllers = require("../controllers/blog-controller");

// Mentee registration route with preprocessing and validation
router.post(
  "/mentee-register",
  menteeControllers.imageUpload,
  (req, res, next) => {
    // Preprocess JSON-stringified array fields and number fields from FormData
    try {
      if (req.body.careerInterests) req.body.careerInterests = JSON.parse(req.body.careerInterests);
      if (req.body.desiredIndustry) req.body.desiredIndustry = JSON.parse(req.body.desiredIndustry);
      if (req.body.skillsToDevelop) req.body.skillsToDevelop = JSON.parse(req.body.skillsToDevelop);
      if (req.body.typeOfMentorshipSought) req.body.typeOfMentorshipSought = JSON.parse(req.body.typeOfMentorshipSought);
      if (req.body.preferredDaysAndTimes) req.body.preferredDaysAndTimes = JSON.parse(req.body.preferredDaysAndTimes);
      if (req.body.expectedGraduationYear) req.body.expectedGraduationYear = Number(req.body.expectedGraduationYear);
    } catch (err) {
      return res.status(400).json({ message: "Invalid format in form data", error: err.message });
    }
    next();
  },
  validate(MenteeSignupSchema),
  menteeControllers.register
);

router.post("/mentee-login", validate(MenteeLoginSchema), menteeControllers.login);
router.get("/mentee-user", menteeMiddleware, menteeControllers.mentee);
router.patch("/mentee-update", menteeMiddleware, menteeControllers.updateUser);
router.get("/mentee-matching-mentors", menteeMiddleware, menteeControllers.getMatchingMentors);
router.post("/mentee-send-request", menteeMiddleware, menteeControllers.sendConnectionRequest);
router.get("/mentee-connected-mentors", menteeMiddleware, menteeControllers.getConnectedMentors);
router.get("/mentee-sent-requests", menteeMiddleware, menteeControllers.getSentRequests);
router.delete("/mentee-withdraw-request", menteeMiddleware, menteeControllers.withdrawRequest);
router.get("/images/:id", menteeControllers.getImageById);

// Skill Assessment Routes
router.get("/assessment/domains", menteeMiddleware, skillAssessmentControllers.getDomains);
router.post("/assessment/start", menteeMiddleware, skillAssessmentControllers.startAssessment);
router.post("/assessment/submit", menteeMiddleware, skillAssessmentControllers.submitAssessment);
router.get("/assessment/history", menteeMiddleware, skillAssessmentControllers.getAssessmentHistory);

// New Job Application Routes
router.get("/jobs/all", menteeMiddleware, menteeControllers.getAllJobs);
router.post("/jobs/apply", menteeMiddleware, menteeControllers.applyToJob);
router.get("/jobs/my-applications", menteeMiddleware, menteeControllers.getMyApplications);

// Blog Routes (Mentee access)
router.get("/blogs/all", menteeMiddleware, blogControllers.getAllPublishedBlogs);
router.post("/mentee-schedule-video-call", menteeMiddleware, menteeControllers.scheduleVideoCall);
module.exports = router;