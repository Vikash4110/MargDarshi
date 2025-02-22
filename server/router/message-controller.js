// const express = require("express");
// const router = express.Router();
// const messageControllers = require("../controllers/message-controller");
// // const authMiddleware = require("../middlewares/auth-middleware");

// router.post("/send-message",  messageControllers.sendMessage);
// router.get("/messages/:userId1/:userId2",  messageControllers.getMessages);

// module.exports = router;

const express = require("express");
const router = express.Router();
const messageControllers = require("../controllers/message-controller");

router.post("/send-message", messageControllers.sendMessage);
router.get("/messages/:userId1/:userId2", messageControllers.getMessages);

module.exports = router;