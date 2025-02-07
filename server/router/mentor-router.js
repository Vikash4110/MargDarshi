const express = require("express");
const router = express.Router();
const mentorControllers = require("../controllers/mentor-controller");
const { SignupSchema, loginSchema } = require("../validators/mentor-validator");
const validate = require("../middlewares/validate-middleware");
const mentorMiddleware = require("../middlewares/mentor-middleware");

// Registration route
router.route("/mentor-register").post(validate(SignupSchema), mentorControllers.register);

// Login route
router.route("/mentor-login").post(validate(loginSchema), mentorControllers.login);

// User details route (protected)
router.route("/mentor-user").get(mentorMiddleware, mentorControllers.mentor);
router.route("/mentor-update").patch(mentorMiddleware, mentorControllers.updateUser);

module.exports = router;
