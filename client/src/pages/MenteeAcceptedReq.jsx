import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaBriefcase, FaIndustry, FaUser, FaTimes, FaPaperPlane, FaCheck, FaCheckDouble } from "react-icons/fa";
import io from "socket.io-client";
import Img from "../assets/profile2.jpg";

const MenteeAcceptedReq = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [acceptedMentors, setAcceptedMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [calendlyLink, setCalendlyLink] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unseenMessages, setUnseenMessages] = useState({});
  const { authorizationToken, user, isLoading: authLoading } = useAuth();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    socketRef.current = io(backendUrl, {
      auth: { token: authorizationToken.replace("Bearer ", "") },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server from mentee:", socketRef.current.id);
      socketRef.current.emit("joinRoom", user._id);
    });

    socketRef.current.on("userStatus", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        isOnline ? updated.add(userId) : updated.delete(userId);
        return updated;
      });
    });

    socketRef.current.on("receiveMessage", (message) => {
      setMessages((prev) => {
        const updated = [...prev, message];
        scrollToBottom();
        if (message.receiverId === user._id && !isChatOpen) {
          setUnseenMessages((prev) => ({
            ...prev,
            [message.senderId]: (prev[message.senderId] || 0) + 1,
          }));
        }
        return updated;
      });
      if (isChatOpen && selectedMentor?._id === message.senderId) {
        socketRef.current.emit("messageSeen", { messageId: message._id, receiverId: user._id });
      }
    });

    socketRef.current.on("messageStatusUpdate", ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg))
      );
    });

    fetchAcceptedMentors();

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => console.log("Calendly script loaded successfully.");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      socketRef.current.disconnect();
    };
  }, [authLoading, user, authorizationToken, backendUrl, isChatOpen, selectedMentor]);

  const fetchAcceptedMentors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-connected-mentors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      setAcceptedMentors(data.connectedMentors);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProfilePictureUrl = (profilePictureId) => {
    return `${backendUrl}/api/auth/images/${profilePictureId}`;
  };

  const handleScheduleMeeting = (mentor) => {
    if (!mentor.calendlyLink) {
      toast.error("Mentor's Calendly link is missing.");
      return;
    }
    setCalendlyLink(mentor.calendlyLink);
    setIsCalendlyOpen(true);
  };

  const closeCalendly = () => {
    setIsCalendlyOpen(false);
    setCalendlyLink("");
  };

  const handleOpenChat = (mentor) => {
    setSelectedMentor(mentor);
    setIsChatOpen(true);
    fetchMessages(mentor._id);
    setUnseenMessages((prev) => ({ ...prev, [mentor._id]: 0 }));
  };

  const fetchMessages = async (mentorId) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/messages/${user._id}/${mentorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data.messages);
      setTimeout(scrollToBottom, 0); // Ensure scroll happens after render
    } catch (err) {
      toast.error("Error fetching messages");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedMentor) return;

    const messageData = {
      senderId: user._id,
      receiverId: selectedMentor._id,
      message: newMessage,
      senderModel: "Mentee",
      receiverModel: "Mentor",
    };

    try {
      const response = await fetch(`${backendUrl}/api/auth/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      const data = await response.json();
      setMessages((prev) => {
        const updated = [...prev, { ...data.newMessage, status: "sent" }];
        scrollToBottom();
        return updated;
      });
      socketRef.current.emit("sendMessage", data.newMessage);
      setNewMessage("");
    } catch (err) {
      toast.error("Error sending message");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedMentor(null);
    setMessages([]);
  };

  if (authLoading) return <LoadingSpinner />;
  if (!user) return <div className="text-center p-6 text-lg text-gray-600">Please log in to view connected mentors.</div>;
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} retry={fetchAcceptedMentors} />;

  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 p-8 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      <motion.h1
        className="text-4xl font-extrabold text-[#127C71] text-center mb-8 tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Connected Mentors with Me
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence>
          {acceptedMentors.map((mentor) => (
            <motion.div
              key={mentor._id}
              className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f6f5c] to-teal-400" />
              <div className="flex items-center space-x-4">
                {mentor.profilePicture ? (
                  <motion.img
                    src={getProfilePictureUrl(mentor.profilePicture)}
                    alt={mentor.fullName}
                    className="w-16 h-16 object-cover rounded-full border-2 border-teal-500 shadow-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-white rounded-full border-2 border-teal-500 flex items-center justify-center">
                    <FaUser className="text-gray-400" size={24} />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 tracking-tight">{mentor.fullName}</h2>
                  <p className="text-base font-bold text-gray-500 flex items-center">
                    <FaBriefcase className="mr-1 text-teal-600" /> {mentor.jobTitle}
                  </p>
                  <p className="text-sm text-gray-600">
                    {onlineUsers.has(mentor._id) ? (
                      <span className="text-green-500">Active Now</span>
                    ) : (
                      <span className="text-gray-500">Offline</span>
                    )}
                  </p>
                </div>
                {unseenMessages[mentor._id] > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unseenMessages[mentor._id]}
                  </span>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-gray-700 flex items-center text-base">
                  <FaIndustry className="mr-2 text-teal-600" />
                  <span className="font-bold text-gray-800">Industry:</span> <span className="ml-1">{mentor.industry}</span>
                </p>
                <p className="text-gray-700 flex items-center text-base">
                  <FaUser className="mr-2 text-teal-600" />
                  <span className="font-bold text-gray-800">Experience:</span> <span className="ml-1">{mentor.yearsOfExperience} years</span>
                </p>
                <p className="text-gray-700 flex items-center text-base">
                  <FaEnvelope className="mr-2 text-teal-600" />
                  <span className="font-bold text-gray-800">Email:</span> <span className="ml-1">{mentor.email}</span>
                </p>
              </div>

              <div className="mt-6 flex flex-col space-y-4">
                <motion.button
                  onClick={() => handleScheduleMeeting(mentor)}
                  className="py-3 rounded-lg font-semibold text-white shadow-md transition duration-300 bg-gradient-to-r from-[#0f6f5c] to-teal-500 hover:from-teal-600 hover:to-teal-700 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaBriefcase className="mr-2" />
                  Schedule Meeting
                </motion.button>
                <motion.button
                  onClick={() => handleOpenChat(mentor)}
                  className="py-3 rounded-lg font-semibold text-white shadow-md transition duration-300 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPaperPlane className="mr-2" />
                  Message
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {isCalendlyOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl p-6 border border-gray-100"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={closeCalendly}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes />
            </motion.button>
            <iframe
              src={calendlyLink}
              className="w-full h-full border-none rounded-2xl"
              title="Calendly Scheduling"
            ></iframe>
          </motion.div>
        </motion.div>
      )}

      {isChatOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative bg-white w-full max-w-lg h-[80vh] rounded-2xl shadow-2xl p-6 flex flex-col"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#127C71]">{selectedMentor?.fullName}</h3>
                <p className="text-sm text-gray-600">
                  {onlineUsers.has(selectedMentor?._id) ? (
                    <span className="text-green-500">Active Now</span>
                  ) : (
                    <span className="text-gray-500">Offline</span>
                  )}
                </p>
              </div>
              <motion.button
                onClick={closeChat}
                className="text-gray-500 hover:text-gray-700 text-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes />
              </motion.button>
            </div>
            <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
              {messages.map((msg, index) => (
                <motion.div
                  key={`${msg._id}-${index}`}
                  className={`mb-4 p-3 rounded-lg ${msg.senderId === user._id ? 'bg-teal-100 ml-auto' : 'bg-gray-200 mr-auto'} max-w-[75%] flex justify-between items-center`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm">{msg.message}</p>
                  <div className="flex items-center">
                    {msg.senderId === user._id && (
                      <>
                        {msg.status === "sent" && <FaCheck className="text-gray-400 ml-2" />}
                        {msg.status === "delivered" && <FaCheckDouble className="text-gray-400 ml-2" />}
                        {msg.status === "seen" && <FaCheckDouble className="text-blue-500 ml-2" />}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <motion.button
                onClick={handleSendMessage}
                className="p-3 bg-teal-500 text-white rounded-r-lg hover:bg-teal-600 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPaperPlane />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Helper Components
const LoadingSpinner = () => (
  <motion.div
    className="flex justify-center items-center h-screen"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    ></motion.div>
  </motion.div>
);

const ErrorDisplay = ({ error, retry }) => (
  <motion.div
    className="text-center p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <p className="text-red-500 text-lg font-semibold">{error}</p>
    <motion.button
      onClick={retry}
      className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Retry
    </motion.button>
  </motion.div>
);

export default MenteeAcceptedReq;