require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const mentorRoute = require("./router/mentor-router");
const menteeRoute = require("./router/mentee-router");
const messageRoute = require("./router/message-controller");
const Message = require("./models/message-model");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://margdarshi.vercel.app", "http://localhost:8000"],
    methods: ["GET", "POST"],
  },
});

app.use("/uploads/blogs", express.static(path.join(__dirname, "uploads/blogs")));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.io = io;
  next();
});

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mentorship";
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    if (userId) {
      socket.join(userId);
      io.emit("userStatus", { userId, isOnline: true });
      console.log(`User ${userId} joined room: ${userId}`);
    }
  });

  socket.on("sendMessage", async (messageData) => {
    const { senderId, receiverId, status } = messageData;
    console.log("Received message data:", messageData);

    if (!senderId || !receiverId) {
      console.error("Invalid message data");
      return;
    }

    const receiverSockets = await io.in(receiverId).fetchSockets();
    if (receiverSockets.length > 0) {
      messageData.status = "delivered";
      io.to(receiverId).emit("receiveMessage", messageData);
      io.to(senderId).emit("messageStatusUpdate", { messageId: messageData._id, status: "delivered" });
    }
  });

  socket.on("messageSeen", async ({ messageId, receiverId }) => {
    try {
      const message = await Message.findByIdAndUpdate(messageId, { status: "seen" }, { new: true });
      io.to(receiverId).emit("messageStatusUpdate", { messageId, status: "seen" });
      io.to(message.senderId).emit("messageStatusUpdate", { messageId, status: "seen" });
    } catch (err) {
      console.error("Error updating message status:", err);
    }
  });

  socket.on("messageDeleted", ({ messageId, receiverId }) => {
    io.to(receiverId).emit("messageDeleted", { messageId });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    const userId = Object.keys(socket.rooms).find((room) => room !== socket.id);
    if (userId) {
      io.emit("userStatus", { userId, isOnline: false });
    }
  });
});

app.use("/api/auth", mentorRoute);
app.use("/api/auth", menteeRoute);
app.use("/api/auth", messageRoute);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});