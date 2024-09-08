const express = require('express');
const router = express.Router();
const menteeControllers = require('../controllers/mentee-controller');
const { MenteeSignupSchema, MenteeLoginSchema } = require('../validators/mentee-validator');
const validate = require('../middlewares/validate-middleware');
const menteeMiddleware = require('../middlewares/mentee-middleware');

// Registration route
router.post('/mentee-register', validate(MenteeSignupSchema), menteeControllers.register);

// Login route
router.post('/mentee-login', validate(MenteeLoginSchema), menteeControllers.login); // Use MenteeLoginSchema for login validation

// User details route (protected)
router.get('/mentee-user', menteeMiddleware, menteeControllers.mentee);

module.exports = router;
