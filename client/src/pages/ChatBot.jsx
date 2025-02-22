import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";
import { IoBulb, IoChatbubbleEllipses, IoDocumentText, IoRocket, IoPeople, IoPhonePortrait, IoShieldCheckmark, IoChatbox } from "react-icons/io5"; // Added React Icons for quick options

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Predefined responses for common questions
  const getBotResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();

    // Define responses for common questions with icons
    const responses = {
      hello: { text: "Hi there! How can I help you today?", icon: IoChatbox },
      features: { text: "MargDarshi offers AI-powered mentor matching, real-time scheduling, video conferencing, and a feedback system.", icon: IoBulb },
      technology: { text: "MargDarshi uses React.js and Tailwind CSS for the frontend, Node.js and Express.js for the backend, MongoDB for the database, and WebRTC for video calls.", icon: IoRocket },
      objectives: { text: "Our objectives are to create a dynamic mentorship ecosystem, implement AI-based mentor matching, integrate real-time scheduling, and provide curated learning resources.", icon: IoPeople },
      "mentor matching": { text: "Mentors are matched using an AI-powered system that considers expertise, preferences, and mentee needs.", icon: IoChatbubbleEllipses },
      "video call": { text: "Mentorship sessions are conducted via video calls using WebRTC. You can schedule sessions through the integrated calendar.", icon: IoPhonePortrait },
      resources: { text: "We provide a curated repository of learning materials, industry guides, and expert insights to help you grow your skills and career.", icon: IoDocumentText },
      feedback: { text: "Mentors and mentees can provide feedback and ratings after each session. This helps maintain quality and improve the mentorship experience.", icon: IoShieldCheckmark },
      contact: { text: "You can reach us at support@margdarshi.com.", icon: IoChatbox },
    };

    for (const [key, value] of Object.entries(responses)) {
      if (lowerCaseMessage.includes(key)) {
        return { ...value, sender: "bot" };
      }
    }

    return { text: "I'm sorry, I didn't understand that. Can you please rephrase or ask another question?", icon: IoChatbox, sender: "bot" };
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    // Add user message
    const userMessage = { text: inputText, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputText);
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  // Handle clicking on a quick option
  const handleQuickOptionClick = (option) => {
    setInputText(option); // Set the input text to the selected option
    handleSendMessage(); // Automatically send the message
  };

  // Scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed bottom-24 right-8 z-50 w-96 bg-white rounded-3xl shadow-2xl border border-teal-200 overflow-hidden flex flex-col"
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaRobot className="text-2xl mr-2" />
          <h2 className="text-xl font-extrabold tracking-tight">MargDarshi Chatbot</h2>
        </div>
        <motion.button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaTimes className="text-xl" />
        </motion.button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-teal-200 scrollbar-track-gray-100">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex items-start max-w-[80%] rounded-xl p-3 shadow-md ${
                  message.sender === "user"
                    ? "bg-blue-100 text-black"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.sender === "bot" && message.icon && (
                  <message.icon className="text-lg mr-2 text-teal-500" />
                )}
                <p className="text-sm font-medium">{message.text}</p>
                {message.sender === "user" && (
                  <FaUser className="text-lg ml-2 text-[#0f6f5c]" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-gray-100 text-gray-900 rounded-xl p-3 shadow-md">
              <p className="text-sm font-medium">Typing...</p>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Options */}
      <div className="border-t border-teal-200 p-4 bg-gray-50">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { label: "Technology", icon: IoRocket },
            { label: "Features", icon: IoBulb },
            { label: "Objectives", icon: IoPeople },
            { label: "Mentor Matching", icon: IoChatbubbleEllipses },
            { label: "Video Call", icon: IoPhonePortrait },
            { label: "Resources", icon: IoDocumentText },
            { label: "Feedback", icon: IoShieldCheckmark },
            { label: "Contact", icon: IoChatbox },
          ].map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleQuickOptionClick(option.label)}
              className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition duration-300 text-sm font-medium shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <option.icon className="inline mr-1 text-teal-500 text-sm" />
              {option.label}
            </motion.button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f6f5c] shadow-sm"
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="ml-2 p-2 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPaperPlane className="text-lg" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Chatbot;