const express = require("express");
const router = express.Router();
const mentorControllers = require("../controllers/mentor-controller");
const { SignupSchema, loginSchema } = require("../validators/mentor-validator");
const validate = require("../middlewares/validate-middleware");
const mentorMiddleware = require("../middlewares/mentor-middleware");


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
//getImageById 
router.route("/images/:id").get(mentorControllers.getImageById)
module.exports = router;
