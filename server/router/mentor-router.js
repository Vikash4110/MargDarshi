const express = require("express");
const router = express.Router();
const mentorControllers = require("../controllers/mentor-controller");
const { SignupSchema, loginSchema } = require("../validators/mentor-validator");
const validate = require("../middlewares/validate-middleware");
const mentorMiddleware = require("../middlewares/mentor-middleware");
const blogControllers = require("../controllers/blog-controller");
const multer = require("multer");
const path = require("path");

// Multer setup for blog image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/blogs"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, and PNG images are allowed"));
    }
  },
});

router.route("/mentor-register")
  .post(
    mentorControllers.imageUpload,
    (req, res, next) => {
      if (req.body.skills) req.body.skills = JSON.parse(req.body.skills);
      if (req.body.mentorshipTopics) req.body.mentorshipTopics = JSON.parse(req.body.mentorshipTopics);
      next();
    },
    validate(SignupSchema),
    mentorControllers.register
  );

router.post("/mentor-verify-otp", mentorControllers.verifyOTP);
router.post("/mentor-forgot-password", mentorControllers.forgotPassword);
router.post("/mentor-reset-password", mentorControllers.resetPassword);

router.post("/mentor-login", validate(loginSchema), mentorControllers.login);
router.get("/mentor-user", mentorMiddleware, mentorControllers.mentor);
router.patch("/mentor-update", mentorMiddleware, mentorControllers.updateUser);
router.post("/mentor-respond-request", mentorMiddleware, mentorControllers.respondToConnectionRequest);
router.get("/mentor-pending-requests", mentorMiddleware, mentorControllers.getPendingRequests);
router.get("/mentor-all", mentorControllers.getAllMentors);
router.get("/mentor-connected-mentees", mentorMiddleware, mentorControllers.getConnectedMentees);
router.post("/update-calendly", mentorMiddleware, mentorControllers.updateCalendlyLink);
router.route("/images/:id").get(mentorControllers.getImageById);

router.post("/mentor-post-job", mentorMiddleware, mentorControllers.postJob);
router.get("/mentor-posted-jobs", mentorMiddleware, mentorControllers.getPostedJobs);
router.get("/mentor-job-applicants/:jobId", mentorMiddleware, mentorControllers.getJobApplicants);
router.patch("/mentor-update-job-status", mentorMiddleware, mentorControllers.updateJobStatus);
router.patch("/mentor-update-application-status", mentorMiddleware, mentorControllers.updateApplicationStatus);

router.post("/mentor-blogs/create", mentorMiddleware, upload.single("image"), blogControllers.createBlog);
router.patch("/mentor-blogs/update", mentorMiddleware, upload.single("image"), blogControllers.updateBlog);
router.delete("/mentor-blogs/delete/:blogId", mentorMiddleware, blogControllers.deleteBlog);
router.get("/mentor-blogs/:mentorId?", mentorMiddleware, blogControllers.getMentorBlogs);
router.post("/mentor-schedule-video-call", mentorMiddleware, mentorControllers.scheduleVideoCall);

router.get("/blogs/all", mentorMiddleware, blogControllers.getAllPublishedBlogs);
router.post("/blogs/like", mentorMiddleware, blogControllers.likeBlog);
router.post("/blogs/comment", mentorMiddleware, blogControllers.commentBlog);
router.post("/blogs/share", mentorMiddleware, blogControllers.shareBlog);

router.post("/update-availability", mentorMiddleware, mentorControllers.updateAvailability);
router.post("/schedule-meeting", mentorMiddleware, mentorControllers.scheduleMeeting);
router.get("/schedule", mentorMiddleware, mentorControllers.getMentorSchedule);

module.exports = router;