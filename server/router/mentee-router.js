const express = require("express");
const router = express.Router();
const menteeControllers = require("../controllers/mentee-controller");
const { MenteeSignupSchema, MenteeLoginSchema } = require("../validators/mentee-validator");
const validate = require("../middlewares/validate-middleware");
const menteeMiddleware = require("../middlewares/mentee-middleware");
const skillAssessmentControllers = require("../controllers/skill-assessment-controller");
const blogControllers = require("../controllers/blog-controller"); // Import blog controllers

router.post("/mentee-register", menteeControllers.imageUpload, menteeControllers.register);
router.post("/mentee-login", validate(MenteeLoginSchema), menteeControllers.login);
router.get("/mentee-user", menteeMiddleware, menteeControllers.mentee);
router.patch("/mentee-update", menteeMiddleware, menteeControllers.updateUser);
router.get("/mentee-matching-mentors", menteeMiddleware, menteeControllers.getMatchingMentors);
router.post("/mentee-send-request", menteeMiddleware, menteeControllers.sendConnectionRequest);
router.get("/mentee-connected-mentors", menteeMiddleware, menteeControllers.getConnectedMentors);
router.get("/mentee-sent-requests", menteeMiddleware, menteeControllers.getSentRequests);
router.delete("/mentee-withdraw-request", menteeMiddleware, menteeControllers.withdrawRequest); // Changed to POST
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
module.exports = router;