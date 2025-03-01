// routes/admin-router.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const adminMiddleware = require("../middlewares/admin-middleware");

// Admin authentication routes
router.post("/register", adminController.registerAdmin); // For initial admin setup
router.post("/login", adminController.loginAdmin);

// Admin dashboard routes (protected)
router.get("/mentors", adminMiddleware, adminController.getAllMentors);
router.get("/mentees", adminMiddleware, adminController.getAllMentees);
router.patch("/mentor/:id", adminMiddleware, adminController.editMentor);
router.patch("/mentee/:id", adminMiddleware, adminController.editMentee);
router.delete("/mentor/:id", adminMiddleware, adminController.deleteMentor);
router.delete("/mentee/:id", adminMiddleware, adminController.deleteMentee);

module.exports = router;