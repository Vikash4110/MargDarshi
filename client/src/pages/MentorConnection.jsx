// src/pages/MentorConnection.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaPhone, FaGraduationCap, FaUniversity, FaBook, FaPaperPlane, FaTimes, FaCheck, FaCheckDouble, FaVideo } from "react-icons/fa";
import io from "socket.io-client";
import Img from "../assets/profile2.jpg";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";


const MentorConnection = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [connectedMentees, setConnectedMentees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unseenMessages, setUnseenMessages] = useState({});
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [videoCallError, setVideoCallError] = useState(null);
  const { authorizationToken, user, isLoading: authLoading } = useAuth();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const videoCallRef = useRef(null);


  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      console.log("No user found after auth loading completed");
      return;
    }

    socketRef.current = io(backendUrl, {
      auth: { token: authorizationToken.replace("Bearer ", "") },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server:", socketRef.current.id);
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
      if (isChatOpen && selectedMentee?._id === message.senderId) {
        socketRef.current.emit("messageSeen", { messageId: message._id, receiverId: user._id });
      }
    });

    socketRef.current.on("messageStatusUpdate", ({ messageId, status }) => {
      setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg)));
    });

    fetchConnectedMentees();

    return () => {
      socketRef.current.disconnect();
    };
  }, [user, authLoading, authorizationToken, backendUrl, isChatOpen, selectedMentee]);

  useEffect(() => {
    if (!isVideoCallOpen || !selectedMentee || !user || !videoCallRef.current) return;

    const startVideoCall = async () => {
      const channelName = `mentor-${user._id}-mentee-${selectedMentee._id}`;
      const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

      try {
        console.log("Requesting media permissions...");
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log("Permissions granted");

        console.log("Generating ZegoCloud kit token with App ID:", appID, "Channel:", channelName);
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          channelName,
          user._id,
          user.fullName
        );
        console.log("Test kit token generated successfully:", kitToken);

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        console.log("ZegoUIKitPrebuilt instance created");

        zp.joinRoom({
          container: videoCallRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          showPreJoinView: false,
          showRoomTimer: true,
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          onJoinRoom: () => {
            console.log("Joined video call room successfully");
          },
          onLeaveRoom: () => {
            setIsVideoCallOpen(false);
            setSelectedMentee(null);
            console.log("Left video call");
          },
          onUserJoin: (users) => {
            console.log("User joined:", users);
          },
          onUserLeave: (users) => {
            console.log("User left:", users);
          },
          onLocalStreamPublished: () => {
            console.log("Local stream published successfully");
          },
          onLocalStreamMirrorModeChanged: (mode) => {
            console.log("Local stream mirror mode changed:", mode);
          },
          onError: (error) => {
            console.error("ZegoCloud error:", error);
            setVideoCallError(`Error ${error.code}: ${error.message || "Failed to join video call"}`);
            toast.error(`Video call error: ${error.code} - ${error.message || "Unknown error"}`);
          },
        });
      } catch (err) {
        console.error("Error starting video call:", err);
        setVideoCallError(err.message || "Failed to start video call - check camera/microphone permissions");
        toast.error("Failed to start video call: " + (err.message || "Unknown error"));
        setIsVideoCallOpen(false);
        setSelectedMentee(null);
      }
    };

    startVideoCall();
  }, [isVideoCallOpen, selectedMentee, user, videoCallRef.current]);

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
      console.log("Connected mentees response:", data);
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
      setTimeout(scrollToBottom, 0);
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
    fetchMessages(mentee._id);
    setUnseenMessages((prev) => ({ ...prev, [mentee._id]: 0 }));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedMentee) return;

    const messageData = {
      senderId: user._id,
      receiverId: selectedMentee._id,
      message: newMessage,
      senderModel: "Mentor",
      receiverModel: "Mentee",
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

  // const handleVideoCall = (mentee) => {
  //   console.log("Video call button clicked for mentee:", mentee._id);
  //   setSelectedMentee(mentee);
  //   setIsVideoCallOpen(true);
  //   setVideoCallError(null);
  // };
  const handleVideoCall = async (mentee) => {
    console.log("Video call button clicked for mentee:", mentee._id);
    setSelectedMentee(mentee);
    setIsVideoCallOpen(true);
    setVideoCallError(null);
  
    // Send email notification to mentee
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-schedule-video-call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ menteeId: mentee._id }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to schedule video call");
      toast.success("Video call scheduled! Email sent to mentee.");
    } catch (err) {
      console.error("Error scheduling video call:", err);
      toast.error("Failed to notify mentee: " + (err.message || "Unknown error"));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedMentee(null);
    setMessages([]);
  };

  const filteredMentees = connectedMentees.filter((mentee) =>
    mentee.fullName.toLowerCase().includes(searchQuery)
  );

  if (authLoading) return <LoadingSpinner />;
  if (!user) return <div className="text-center p-6 text-lg text-gray-600">Please log in to view connected mentees.</div>;
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} retry={fetchConnectedMentees} />;

  return (
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
            className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f6f5c] to-teal-400" />
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24">
                <img
                  src={mentee.profilePicture ? `${backendUrl}/api/auth/images/${mentee.profilePicture}` : Img}
                  alt={mentee.fullName}
                  className="w-full h-full object-cover rounded-full border-4 border-teal-500 shadow-md"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#127C71]">{mentee.fullName}</h2>
                <p className="text-sm text-gray-600">
                  {onlineUsers.has(mentee._id) ? (
                    <span className="text-green-500">Active Now</span>
                  ) : (
                    <span className="text-gray-500">Offline</span>
                  )}
                </p>
              </div>
              {unseenMessages[mentee._id] > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unseenMessages[mentee._id]}
                </span>
              )}
            </div>
            <div className="text-gray-600 mt-2 space-y-2">
              <div className="flex items-center">
                <FaEnvelope className="text-teal-500 mr-2" />
                <p>{mentee.email}</p>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-teal-500 mr-2" />
                <p>{mentee.phoneNumber || "N/A"}</p>
              </div>
              <div className="flex items-center">
                <FaGraduationCap className="text-teal-500 mr-2" />
                <p>{mentee.currentEducationLevel || "N/A"}</p>
              </div>
              <div className="flex items-center">
                <FaUniversity className="text-teal-500 mr-2" />
                <p>{mentee.universityName || "N/A"}</p>
              </div>
              <div className="flex items-center">
                <FaBook className="text-teal-500 mr-2" />
                <p>{mentee.fieldOfStudy || "N/A"}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <motion.button
                onClick={() => handleOpenChat(mentee)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPaperPlane className="mr-2" />
                Message
              </motion.button>
              <motion.button
                onClick={() => handleVideoCall(mentee)}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-lg font-semibold shadow-md hover:from-teal-600 hover:to-teal-800 transition duration-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaVideo className="mr-2" />
                Video Conferencing
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

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
                <h3 className="text-xl font-bold text-[#127C71]">{selectedMentee?.fullName}</h3>
                <p className="text-sm text-gray-600">
                  {onlineUsers.has(selectedMentee?._id) ? (
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

      {isVideoCallOpen && (
        <motion.div
          className="fixed inset-0 w-full h-full z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full h-full bg-black relative">
            {videoCallError ? (
              <div className="flex items-center justify-center h-full text-red-500 text-lg font-semibold">
                {videoCallError}
              </div>
            ) : (
              <div ref={videoCallRef} className="w-full h-full" />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

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

// src/pages/MentorConnection.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { motion } from "framer-motion";
// import { useAuth } from "../store/auth";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEnvelope, FaPhone, FaGraduationCap, FaUniversity, FaBook, FaPaperPlane, FaTimes, FaCheck, FaCheckDouble, FaVideo, FaCalendar } from "react-icons/fa";
// import io from "socket.io-client";
// import Img from "../assets/profile2.jpg";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import ScheduleMeeting from "../Components/ScheduleMeeting";

// const MentorConnection = () => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [connectedMentees, setConnectedMentees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [selectedMentee, setSelectedMentee] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [onlineUsers, setOnlineUsers] = useState(new Set());
//   const [unseenMessages, setUnseenMessages] = useState({});
//   const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
//   const [isScheduleOpen, setIsScheduleOpen] = useState(false);
//   const [videoCallError, setVideoCallError] = useState(null);
//   const { authorizationToken, user, isLoading: authLoading } = useAuth();
//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const videoCallRef = useRef(null);

//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       console.log("No user found after auth loading completed");
//       return;
//     }

//     socketRef.current = io(backendUrl, {
//       auth: { token: authorizationToken.replace("Bearer ", "") },
//     });

//     socketRef.current.on("connect", () => {
//       console.log("Connected to Socket.IO server:", socketRef.current.id);
//       socketRef.current.emit("joinRoom", user._id);
//     });

//     socketRef.current.on("userStatus", ({ userId, isOnline }) => {
//       setOnlineUsers((prev) => {
//         const updated = new Set(prev);
//         isOnline ? updated.add(userId) : updated.delete(userId);
//         return updated;
//       });
//     });

//     socketRef.current.on("receiveMessage", (message) => {
//       setMessages((prev) => {
//         const updated = [...prev, message];
//         scrollToBottom();
//         if (message.receiverId === user._id && !isChatOpen) {
//           setUnseenMessages((prev) => ({
//             ...prev,
//             [message.senderId]: (prev[message.senderId] || 0) + 1,
//           }));
//         }
//         return updated;
//       });
//       if (isChatOpen && selectedMentee?._id === message.senderId) {
//         socketRef.current.emit("messageSeen", { messageId: message._id, receiverId: user._id });
//       }
//     });

//     socketRef.current.on("messageStatusUpdate", ({ messageId, status }) => {
//       setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg)));
//     });

//     fetchConnectedMentees();

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [user, authLoading, authorizationToken, backendUrl, isChatOpen, selectedMentee]);

//   useEffect(() => {
//     if (!isVideoCallOpen || !selectedMentee || !user || !videoCallRef.current) return;

//     const startVideoCall = async () => {
//       const channelName = `mentor-${user._id}-mentee-${selectedMentee._id}`;
//       const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
//       const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

//       try {
//         console.log("Requesting media permissions...");
//         await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         console.log("Permissions granted");

//         console.log("Generating ZegoCloud kit token with App ID:", appID, "Channel:", channelName);
//         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//           appID,
//           serverSecret,
//           channelName,
//           user._id,
//           user.fullName
//         );
//         console.log("Test kit token generated successfully:", kitToken);

//         const zp = ZegoUIKitPrebuilt.create(kitToken);
//         console.log("ZegoUIKitPrebuilt instance created");

//         zp.joinRoom({
//           container: videoCallRef.current,
//           scenario: {
//             mode: ZegoUIKitPrebuilt.VideoConference,
//           },
//           showPreJoinView: false,
//           showRoomTimer: true,
//           turnOnCameraWhenJoining: true,
//           turnOnMicrophoneWhenJoining: true,
//           onJoinRoom: () => {
//             console.log("Joined video call room successfully");
//           },
//           onLeaveRoom: () => {
//             setIsVideoCallOpen(false);
//             setSelectedMentee(null);
//             console.log("Left video call");
//           },
//           onUserJoin: (users) => {
//             console.log("User joined:", users);
//           },
//           onUserLeave: (users) => {
//             console.log("User left:", users);
//           },
//           onLocalStreamPublished: () => {
//             console.log("Local stream published successfully");
//           },
//           onLocalStreamMirrorModeChanged: (mode) => {
//             console.log("Local stream mirror mode changed:", mode);
//           },
//           onError: (error) => {
//             console.error("ZegoCloud error:", error);
//             setVideoCallError(`Error ${error.code}: ${error.message || "Failed to join video call"}`);
//             toast.error(`Video call error: ${error.code} - ${error.message || "Unknown error"}`);
//           },
//         });
//       } catch (err) {
//         console.error("Error starting video call:", err);
//         setVideoCallError(err.message || "Failed to start video call - check camera/microphone permissions");
//         toast.error("Failed to start video call: " + (err.message || "Unknown error"));
//         setIsVideoCallOpen(false);
//         setSelectedMentee(null);
//       }
//     };

//     startVideoCall();
//   }, [isVideoCallOpen, selectedMentee, user, videoCallRef.current]);

//   const fetchConnectedMentees = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${backendUrl}/api/auth/mentor-connected-mentees`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//       });
//       if (!response.ok) throw new Error(`API Error: ${response.status}`);
//       const data = await response.json();
//       console.log("Connected mentees response:", data);
//       setConnectedMentees(data.connectedMentees);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMessages = async (menteeId) => {
//     try {
//       const response = await fetch(`${backendUrl}/api/auth/messages/${user._id}/${menteeId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//       });
//       if (!response.ok) throw new Error("Failed to fetch messages");
//       const data = await response.json();
//       setMessages(data.messages);
//       setTimeout(scrollToBottom, 0);
//     } catch (err) {
//       toast.error("Error fetching messages");
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value.toLowerCase());
//   };

//   const handleOpenChat = (mentee) => {
//     setSelectedMentee(mentee);
//     setIsChatOpen(true);
//     fetchMessages(mentee._id);
//     setUnseenMessages((prev) => ({ ...prev, [mentee._id]: 0 }));
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !user || !selectedMentee) return;

//     const messageData = {
//       senderId: user._id,
//       receiverId: selectedMentee._id,
//       message: newMessage,
//       senderModel: "Mentor",
//       receiverModel: "Mentee",
//     };

//     try {
//       const response = await fetch(`${backendUrl}/api/auth/send-message`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify(messageData),
//       });
//       if (!response.ok) throw new Error("Failed to send message");
//       const data = await response.json();
//       setMessages((prev) => {
//         const updated = [...prev, { ...data.newMessage, status: "sent" }];
//         scrollToBottom();
//         return updated;
//       });
//       socketRef.current.emit("sendMessage", data.newMessage);
//       setNewMessage("");
//     } catch (err) {
//       toast.error("Error sending message");
//     }
//   };

//   const handleVideoCall = async (mentee) => {
//     console.log("Video call button clicked for mentee:", mentee._id);
//     setSelectedMentee(mentee);
//     setIsVideoCallOpen(true);
//     setVideoCallError(null);

//     try {
//       const response = await fetch(`${backendUrl}/api/auth/mentor-schedule-video-call`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify({ menteeId: mentee._id }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to schedule video call");
//       toast.success("Video call scheduled! Email sent to mentee.");
//     } catch (err) {
//       console.error("Error scheduling video call:", err);
//       toast.error("Failed to notify mentee: " + (err.message || "Unknown error"));
//     }
//   };

//   const handleScheduleMeeting = (mentee) => {
//     setSelectedMentee(mentee);
//     setIsScheduleOpen(true);
//   };

//   const closeSchedule = () => {
//     setIsScheduleOpen(false);
//     setSelectedMentee(null);
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const closeChat = () => {
//     setIsChatOpen(false);
//     setSelectedMentee(null);
//     setMessages([]);
//   };

//   const filteredMentees = connectedMentees.filter((mentee) =>
//     mentee.fullName.toLowerCase().includes(searchQuery)
//   );

//   if (authLoading) return <LoadingSpinner />;
//   if (!user) return <div className="text-center p-6 text-lg text-gray-600">Please log in to view connected mentees.</div>;
//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorDisplay error={error} retry={fetchConnectedMentees} />;

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100">
//       <h1 className="text-4xl font-extrabold text-center text-[#127C71] mb-6 tracking-tight">
//         Connected Mentees
//       </h1>

//       <div className="mb-6 flex justify-center">
//         <input
//           type="text"
//           placeholder="Search by name..."
//           value={searchQuery}
//           onChange={handleSearch}
//           className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//         />
//       </div>

//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6 }}
//       >
//         {filteredMentees.map((mentee) => (
//           <motion.div
//             key={mentee._id}
//             className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
//             whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
//           >
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f6f5c] to-teal-400" />
//             <div className="flex items-center space-x-4">
//               <div className="w-24 h-24">
//                 <img
//                   src={mentee.profilePicture ? `${backendUrl}/api/auth/images/${mentee.profilePicture}` : Img}
//                   alt={mentee.fullName}
//                   className="w-full h-full object-cover rounded-full border-4 border-teal-500 shadow-md"
//                 />
//               </div>
//               <div className="flex-1">
//                 <h2 className="text-xl font-bold text-[#127C71]">{mentee.fullName}</h2>
//                 <p className="text-sm text-gray-600">
//                   {onlineUsers.has(mentee._id) ? (
//                     <span className="text-green-500">Active Now</span>
//                   ) : (
//                     <span className="text-gray-500">Offline</span>
//                   )}
//                 </p>
//               </div>
//               {unseenMessages[mentee._id] > 0 && (
//                 <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                   {unseenMessages[mentee._id]}
//                 </span>
//               )}
//             </div>
//             <div className="text-gray-600 mt-2 space-y-2">
//               <div className="flex items-center">
//                 <FaEnvelope className="text-teal-500 mr-2" />
//                 <p>{mentee.email}</p>
//               </div>
//               <div className="flex items-center">
//                 <FaPhone className="text-teal-500 mr-2" />
//                 <p>{mentee.phoneNumber || "N/A"}</p>
//               </div>
//               <div className="flex items-center">
//                 <FaGraduationCap className="text-teal-500 mr-2" />
//                 <p>{mentee.currentEducationLevel || "N/A"}</p>
//               </div>
//               <div className="flex items-center">
//                 <FaUniversity className="text-teal-500 mr-2" />
//                 <p>{mentee.universityName || "N/A"}</p>
//               </div>
//               <div className="flex items-center">
//                 <FaBook className="text-teal-500 mr-2" />
//                 <p>{mentee.fieldOfStudy || "N/A"}</p>
//               </div>
//             </div>
//             <div className="mt-4 flex flex-col space-y-4">
//               <motion.button
//                 onClick={() => handleScheduleMeeting(mentee)}
//                 className="px-4 py-2 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg font-semibold shadow-md hover:from-teal-600 hover:to-teal-700 transition duration-300 flex items-center justify-center"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FaCalendar className="mr-2" />
//                 Schedule Meeting
//               </motion.button>
//               <motion.button
//                 onClick={() => handleOpenChat(mentee)}
//                 className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300 flex items-center justify-center"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FaPaperPlane className="mr-2" />
//                 Message
//               </motion.button>
//               <motion.button
//                 onClick={() => handleVideoCall(mentee)}
//                 className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-lg font-semibold shadow-md hover:from-teal-600 hover:to-teal-800 transition duration-300 flex items-center justify-center"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FaVideo className="mr-2" />
//                 Video Conferencing
//               </motion.button>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       {isScheduleOpen && (
//         <ScheduleMeeting
//           mentor={selectedMentee}
//           user={user}
//           onClose={closeSchedule}
//           authorizationToken={authorizationToken}
//           backendUrl={backendUrl}
//           isMentorView={true}
//         />
//       )}

//       {isChatOpen && (
//         <motion.div
//           className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <motion.div
//             className="relative bg-white w-full max-w-lg h-[80vh] rounded-2xl shadow-2xl p-6 flex flex-col"
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0.9 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <h3 className="text-xl font-bold text-[#127C71]">{selectedMentee?.fullName}</h3>
//                 <p className="text-sm text-gray-600">
//                   {onlineUsers.has(selectedMentee?._id) ? (
//                     <span className="text-green-500">Active Now</span>
//                   ) : (
//                     <span className="text-gray-500">Offline</span>
//                   )}
//                 </p>
//               </div>
//               <motion.button
//                 onClick={closeChat}
//                 className="text-gray-500 hover:text-gray-700 text-xl"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <FaTimes />
//               </motion.button>
//             </div>
//             <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
//               {messages.map((msg, index) => (
//                 <motion.div
//                   key={`${msg._id}-${index}`}
//                   className={`mb-4 p-3 rounded-lg ${msg.senderId === user._id ? 'bg-teal-100 ml-auto' : 'bg-gray-200 mr-auto'} max-w-[75%] flex justify-between items-center`}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <p className="text-sm">{msg.message}</p>
//                   <div className="flex items-center">
//                     {msg.senderId === user._id && (
//                       <>
//                         {msg.status === "sent" && <FaCheck className="text-gray-400 ml-2" />}
//                         {msg.status === "delivered" && <FaCheckDouble className="text-gray-400 ml-2" />}
//                         {msg.status === "seen" && <FaCheckDouble className="text-blue-500 ml-2" />}
//                       </>
//                     )}
//                   </div>
//                 </motion.div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//             <div className="flex items-center">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//               />
//               <motion.button
//                 onClick={handleSendMessage}
//                 className="p-3 bg-teal-500 text-white rounded-r-lg hover:bg-teal-600 transition duration-300"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FaPaperPlane />
//               </motion.button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {isVideoCallOpen && (
//         <motion.div
//           className="fixed inset-0 w-full h-full z-[1000]"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="w-full h-full bg-black relative">
//             {videoCallError ? (
//               <div className="flex items-center justify-center h-full text-red-500 text-lg font-semibold">
//                 {videoCallError}
//               </div>
//             ) : (
//               <div ref={videoCallRef} className="w-full h-full" />
//             )}
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center h-screen">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500" />
//   </div>
// );

// const ErrorDisplay = ({ error, retry }) => (
//   <div className="text-center p-6">
//     <p className="text-red-500 text-lg font-semibold">{error}</p>
//     <button onClick={retry} className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition">
//       Retry
//     </button>
//   </div>
// );

// export default MentorConnection;