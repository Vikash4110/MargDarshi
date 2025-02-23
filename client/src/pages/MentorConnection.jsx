// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useAuth } from "../store/auth";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEnvelope, FaPhone, FaGraduationCap, FaUniversity, FaBook } from "react-icons/fa";
// import Img from "../assets/profile2.jpg"; // Default profile picture
// import Dash from '../pages/Dash'
// const MentorConnection = () => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [connectedMentees, setConnectedMentees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const { authorizationToken } = useAuth();

//   useEffect(() => {
//     fetchConnectedMentees();
//   }, []);

//   const fetchConnectedMentees = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(
//         `${backendUrl}/api/auth/mentor-connected-mentees`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: authorizationToken,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       setConnectedMentees(data.connectedMentees);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);
//   };

//   const filteredMentees = connectedMentees.filter((mentee) =>
//     mentee.fullName.toLowerCase().includes(searchQuery)
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center p-6">
//         <p className="text-red-500 text-lg font-semibold">{error}</p>
//         <button
//           onClick={fetchConnectedMentees}
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//     <Dash/>
//     <div className="p-6">
//       <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-6">
//         Connected Mentees
//       </h1>

//       <div className="mb-6 flex justify-center">
//         <input
//           type="text"
//           placeholder="Search by name..."
//           value={searchQuery}
//           onChange={handleSearch}
//           className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6 }}
//       >
//         {filteredMentees.map((mentee) => (
//           <motion.div
//             key={mentee._id}
//             className="bg-white p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
//             whileHover={{ scale: 1.03 }}
//           >
//             <div className="w-24 h-24 mx-auto">
//               <img
//                 src={Img}
//                 alt={mentee.fullName}
//                 className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-md"
//               />
//             </div>

//             <h2 className="mt-4 text-xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
//               {mentee.fullName}
//             </h2>

//             <div className="text-gray-600 mt-2 space-y-2">
//               <div className="flex items-center">
//                 <FaEnvelope className="text-blue-500 mr-2" />
//                 <p>{mentee.email}</p>
//               </div>
//               <div className="flex items-center">
//                 <FaPhone className="text-green-500 mr-2" />
//                 <p>{mentee.phoneNumber}</p>
//               </div>
//               <div className="flex items-center">
//                 <FaGraduationCap className="text-purple-500 mr-2" />
//                 <p>{mentee.currentEducationLevel}</p>
//               </div>
//               <div className="flex items-center">
//                 <FaUniversity className="text-indigo-500 mr-2" />
//                 <p>{mentee.universityName}</p>
//               </div>
//               <div className="flex items-center">
//                 <FaBook className="text-pink-500 mr-2" />
//                 <p>{mentee.fieldOfStudy}</p>
//               </div>
//             </div>

//             <div className="mt-4 flex justify-center space-x-4">
//               <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
//               >
//                 Message
//               </button>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>
//     </div>
//     </>
//   );
// };

// export default MentorConnection;

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaPhone, FaGraduationCap, FaUniversity, FaBook, FaPaperPlane, FaTimes } from "react-icons/fa";
import io from "socket.io-client"; // Import Socket.IO client
import Img from "../assets/profile2.jpg"; // Default profile picture
import Dash from '../pages/Dash';

const MentorConnection = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [connectedMentees, setConnectedMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat modal state
  const [selectedMentee, setSelectedMentee] = useState(null); // Selected mentee for chat
  const [messages, setMessages] = useState([]); // Chat messages
  const [newMessage, setNewMessage] = useState(""); // New message input
  const { authorizationToken, user } = useAuth();
  const socketRef = useRef(null); // Socket.IO reference

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io(backendUrl, {
      auth: { token: authorizationToken.replace("Bearer ", "") },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server:", socketRef.current.id);
      socketRef.current.emit("joinRoom", user._id); // Join user's room
    });

    socketRef.current.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    fetchConnectedMentees();

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const fetchConnectedMentees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-connected-mentees`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      setConnectedMentees(data.connectedMentees);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (menteeId) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/messages/${user._id}/${menteeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data.messages);
    } catch (err) {
      toast.error("Error fetching messages");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleOpenChat = (mentee) => {
    setSelectedMentee(mentee);
    setIsChatOpen(true);
    fetchMessages(mentee._id); // Fetch previous messages
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: user._id,
      receiverId: selectedMentee._id,
      message: newMessage,
    };

    try {
      const response = await fetch(`${backendUrl}/api/auth/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({
          ...messageData,
          senderModel: "Mentor",
          receiverModel: "Mentee",
        }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      const data = await response.json();
      setMessages((prev) => [...prev, data.newMessage]);
      socketRef.current.emit("sendMessage", data.newMessage);
      setNewMessage("");
    } catch (err) {
      toast.error("Error sending message");
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedMentee(null);
    setMessages([]);
  };

  const filteredMentees = connectedMentees.filter((mentee) =>
    mentee.fullName.toLowerCase().includes(searchQuery)
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} retry={fetchConnectedMentees} />;

  return (
    <>
      <Dash />
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100">
        <h1 className="text-4xl font-extrabold text-center text-[#127C71] mb-6 tracking-tight">
          Connected Mentees
        </h1>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {filteredMentees.map((mentee) => (
            <motion.div
              key={mentee._id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f6f5c] to-teal-400" />
              <div className="w-24 h-24 mx-auto">
                <img
                  src={Img} // Replace with actual profile picture if available
                  alt={mentee.fullName}
                  className="w-full h-full object-cover rounded-full border-4 border-teal-500 shadow-md"
                />
              </div>
              <h2 className="mt-4 text-xl font-bold text-center text-[#127C71]">{mentee.fullName}</h2>
              <div className="text-gray-600 mt-2 space-y-2">
                <div className="flex items-center">
                  <FaEnvelope className="text-teal-500 mr-2" />
                  <p>{mentee.email}</p>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-teal-500 mr-2" />
                  <p>{mentee.phoneNumber}</p>
                </div>
                <div className="flex items-center">
                  <FaGraduationCap className="text-teal-500 mr-2" />
                  <p>{mentee.currentEducationLevel}</p>
                </div>
                <div className="flex items-center">
                  <FaUniversity className="text-teal-500 mr-2" />
                  <p>{mentee.universityName}</p>
                </div>
                <div className="flex items-center">
                  <FaBook className="text-teal-500 mr-2" />
                  <p>{mentee.fieldOfStudy}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <motion.button
                  onClick={() => handleOpenChat(mentee)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Message
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Chat Modal */}
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
                <h3 className="text-xl font-bold text-[#127C71]">{selectedMentee?.fullName}</h3>
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
                  <div
                    key={index}
                    className={`mb-2 p-3 rounded-lg ${msg.senderId === user._id ? 'bg-teal-100 ml-auto' : 'bg-gray-200 mr-auto'} max-w-[75%]`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
      </div>
    </>
  );
};

// Helper Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500" />
  </div>
);

const ErrorDisplay = ({ error, retry }) => (
  <div className="text-center p-6">
    <p className="text-red-500 text-lg font-semibold">{error}</p>
    <button onClick={retry} className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition">
      Retry
    </button>
  </div>
);

export default MentorConnection;