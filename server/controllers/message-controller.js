const Message = require("../models/message-model");

const sendMessage = async (req, res) => {
  try {
    const { senderId, senderModel, receiverId, receiverModel, message } = req.body;

    if (!senderId || !senderModel || !receiverId || !receiverModel || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = new Message({
      senderId,
      senderModel,
      receiverId,
      receiverModel,
      message,
    });

    await newMessage.save();
    console.log("Message saved to database:", newMessage);

    // Emit the message to the receiver via WebSocket
    req.io.to(receiverId).emit("receiveMessage", newMessage);
    console.log(`Message sent to receiver ${receiverId}`);

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    if (!userId1 || !userId2) {
      return res.status(400).json({ message: "User IDs are required" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { sendMessage, getMessages };