const express = require('express');
const router = express.Router();
const menteeControllers = require('../controllers/mentee-controller');
const { MenteeSignupSchema, MenteeLoginSchema } = require('../validators/mentee-validator');
const validate = require('../middlewares/validate-middleware');
const menteeMiddleware = require('../middlewares/mentee-middleware');

 // Registration route
// router.post('/mentee-register', validate(MenteeSignupSchema), menteeControllers.register);
router.post('/mentee-register', menteeControllers.imageUpload, menteeControllers.register);

// Login route
router.post('/mentee-login', validate(MenteeLoginSchema), menteeControllers.login); // Use MenteeLoginSchema for login validation

// User details route (protected)
router.get('/mentee-user', menteeMiddleware, menteeControllers.mentee);

router.route("/mentee-update").patch(menteeMiddleware, menteeControllers.updateUser);
router.get("/mentee-matching-mentors", menteeMiddleware, menteeControllers.getMatchingMentors);
router.post("/mentee-send-request", menteeMiddleware, menteeControllers.sendConnectionRequest);
router.get("/mentee-connected-mentors", menteeMiddleware, menteeControllers.getConnectedMentors);
router.get("/mentee-sent-requests", menteeMiddleware, menteeControllers.getSentRequests);
router.delete("/mentee-withdraw-request", menteeMiddleware, menteeControllers.withdrawRequest);
router.route("/images/:id").get(menteeControllers.getImageById)



module.exports = router;
