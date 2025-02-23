import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import io from "socket.io-client";
import { useAuth } from "../store/auth";

const ChatModal = ({ isOpen, onClose, currentUser, targetUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const { authorizationToken } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Connect to Socket.IO and fetch initial messages when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchMessages();

      const newSocket = io(backendUrl, {
        query: { token: authorizationToken },
      });
      setSocket(newSocket);
      newSocket.emit("joinRoom", currentUser._id);

      newSocket.on("receiveMessage", (message) => {
        if (
          (message.senderId === targetUser._id && message.receiverId === currentUser._id) ||
          (message.senderId === currentUser._id && message.receiverId === targetUser._id)
        ) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, currentUser, targetUser, authorizationToken, backendUrl]);

  // Fetch conversation history
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/auth/messages/${currentUser._id}/${targetUser._id}`,
        {
          method: "GET",
          headers: {
            Authorization: authorizationToken,
          },
        }
      );
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      senderId: currentUser._id,
      senderModel: currentUser.role === "mentor" ? "Mentor" : "Mentee",
      receiverId: targetUser._id,
      receiverModel: targetUser.role === "mentor" ? "Mentor" : "Mentee",
      message: newMessage,
    };

    try {
      await fetch(`${backendUrl}/api/auth/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(messageData),
      });

      socket.emit("sendMessage", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-4">Chat with {targetUser.fullName}</h2>
        <div className="h-64 overflow-y-auto mb-4 border p-2 rounded">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.senderId === currentUser._id ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`inline-block p-2 rounded-lg ${
                  msg.senderId === currentUser._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.message}
              </p>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-l-lg"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-2 rounded-r-lg"
          >
            <FaPaperPlane />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatModal;