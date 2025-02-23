const express = require("express");
const router = express.Router();
const mentorControllers = require("../controllers/mentor-controller");
const { SignupSchema, loginSchema } = require("../validators/mentor-validator");
const validate = require("../middlewares/validate-middleware");
const mentorMiddleware = require("../middlewares/mentor-middleware");
const blogControllers = require("../controllers/blog-controller"); // Import blog controllers

// router.route("/mentor-register").post(mentorControllers.imageUpload, mentorControllers.register); 
// Mentor registration route
router.route("/mentor-register")
    .post(
        mentorControllers.imageUpload, // Multer middleware for file upload
        mentorControllers.register // Registration controller
    );


router.post("/mentor-login", validate(loginSchema), mentorControllers.login);
router.get("/mentor-user",mentorMiddleware, mentorControllers.mentor);
router.patch("/mentor-update", mentorMiddleware, mentorControllers.updateUser);
router.post("/mentor-respond-request", mentorMiddleware, mentorControllers.respondToConnectionRequest);
router.get("/mentor-pending-requests", mentorMiddleware, mentorControllers.getPendingRequests);
router.get("/mentor-all", mentorControllers.getAllMentors);
router.get("/mentor-connected-mentees", mentorMiddleware, mentorControllers.getConnectedMentees);
router.post("/update-calendly", mentorMiddleware, mentorControllers.updateCalendlyLink);
router.route("/images/:id").get(mentorControllers.getImageById)
module.exports = router;

// New Job Posting Routes
router.post("/mentor-post-job", mentorMiddleware, mentorControllers.postJob);
router.get("/mentor-posted-jobs", mentorMiddleware, mentorControllers.getPostedJobs);
router.get("/mentor-job-applicants/:jobId", mentorMiddleware, mentorControllers.getJobApplicants);
router.patch("/mentor-update-job-status", mentorMiddleware, mentorControllers.updateJobStatus);
router.patch("/mentor-update-application-status", mentorMiddleware, mentorControllers.updateApplicationStatus); // New route

// Blog Routes (Mentor-specific)
router.post("/mentor-blogs/create", mentorMiddleware, blogControllers.createBlog);
router.patch("/mentor-blogs/update", mentorMiddleware, blogControllers.updateBlog);
router.delete("/mentor-blogs/delete/:blogId", mentorMiddleware, blogControllers.deleteBlog);
router.get("/mentor-blogs/:mentorId?", mentorMiddleware, blogControllers.getMentorBlogs); // Optional mentorId param