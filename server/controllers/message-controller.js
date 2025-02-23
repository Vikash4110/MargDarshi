const Message = require("../models/message-model");

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, senderModel, receiverModel } = req.body;
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      senderModel,
      receiverModel,
    });
    await newMessage.save();
    res.status(201).json({ newMessage });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
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