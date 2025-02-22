import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaPhone, FaGraduationCap, FaUniversity, FaBook } from "react-icons/fa";
import Img from "../assets/profile2.jpg"; // Default profile picture
import Dash from '../pages/Dash'
const MentorConnection = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [connectedMentees, setConnectedMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { authorizationToken } = useAuth();

  useEffect(() => {
    fetchConnectedMentees();
  }, []);

  const fetchConnectedMentees = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${backendUrl}/api/auth/mentor-connected-mentees`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setConnectedMentees(data.connectedMentees);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filteredMentees = connectedMentees.filter((mentee) =>
    mentee.fullName.toLowerCase().includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
        <button
          onClick={fetchConnectedMentees}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
    <Dash/>
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-6">
        Connected Mentees
      </h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {filteredMentees.map((mentee) => (
          <motion.div
            key={mentee._id}
            className="bg-white p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
            whileHover={{ scale: 1.03 }}
          >
            <div className="w-24 h-24 mx-auto">
              <img
                src={Img}
                alt={mentee.fullName}
                className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-md"
              />
            </div>

            <h2 className="mt-4 text-xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              {mentee.fullName}
            </h2>

            <div className="text-gray-600 mt-2 space-y-2">
              <div className="flex items-center">
                <FaEnvelope className="text-blue-500 mr-2" />
                <p>{mentee.email}</p>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-green-500 mr-2" />
                <p>{mentee.phoneNumber}</p>
              </div>
              <div className="flex items-center">
                <FaGraduationCap className="text-purple-500 mr-2" />
                <p>{mentee.currentEducationLevel}</p>
              </div>
              <div className="flex items-center">
                <FaUniversity className="text-indigo-500 mr-2" />
                <p>{mentee.universityName}</p>
              </div>
              <div className="flex items-center">
                <FaBook className="text-pink-500 mr-2" />
                <p>{mentee.fieldOfStudy}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Message
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
    </>
  );
};

export default MentorConnection;



// import { useEffect, useState } from "react";
// import { useAuth } from "../store/auth";
// import io from "socket.io-client";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { motion } from "framer-motion";
// import { FaEnvelope, FaPhone, FaGraduationCap, FaUniversity, FaBook } from "react-icons/fa";
// import Img from "../assets/profile2.jpg"; // Ensure you have a valid image path

// const MentorConnection = () => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const { authorizationToken, user } = useAuth();
//   const [connectedMentees, setConnectedMentees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedMentee, setSelectedMentee] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io(backendUrl);
//     setSocket(newSocket);

//     newSocket.emit("joinRoom", user._id);
//     console.log(`User ${user._id} joined room`);

//     newSocket.on("receiveMessage", (message) => {
//       console.log("Received message:", message);
//       if (message.senderId === selectedMentee?._id || message.receiverId === selectedMentee?._id) {
//         setMessages((prevMessages) => [...prevMessages, message]);
//       }
//     });

//     return () => {
//       newSocket.off("receiveMessage");
//       newSocket.disconnect();
//     };
//   }, [selectedMentee]);

//   useEffect(() => {
//     fetchConnectedMentees();
//   }, []);

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

//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedMentee) return;

//     const messageData = {
//       senderId: user._id,
//       receiverId: selectedMentee._id,
//       message: newMessage,
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

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       setMessages((prevMessages) => [...prevMessages, data.newMessage]);
//       setNewMessage("");
//     } catch (err) {
//       console.error("Error sending message:", err);
//       toast.error("Failed to send message");
//     }
//   };

//   const filteredMentees = connectedMentees.filter((mentee) =>
//     mentee.fullName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h1>Connected Mentees</h1>
//       <div className="mb-6 flex justify-center">
//         <input
//           type="text"
//           placeholder="Search by name..."
//           value={searchQuery}
//           onChange={handleSearch}
//           className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div className="flex">
//         <motion.div className="w-1/3 pr-6">
//           {filteredMentees.map((mentee) => (
//             <motion.div
//               key={mentee._id}
//               className="bg-white p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 mb-4 cursor-pointer"
//               whileHover={{ scale: 1.03 }}
//               onClick={() => setSelectedMentee(mentee)}
//             >
//               <img src={Img} alt={mentee.fullName} className="w-24 h-24 mx-auto rounded-full border-4 border-blue-500" />
//               <h2 className="mt-4 text-xl font-bold text-center text-blue-500">{mentee.fullName}</h2>
//             </motion.div>
//           ))}
//         </motion.div>

//         <div className="w-2/3">
//           {selectedMentee && (
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <h2 className="text-2xl font-bold mb-4">Chat with {selectedMentee.fullName}</h2>
//               <div className="h-96 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-4">
//                 {messages.map((message) => (
//                   <div key={message._id} className={`mb-4 ${message.senderId === user._id ? "text-right" : "text-left"}`}>
//                     <div className={`inline-block p-3 rounded-lg ${message.senderId === user._id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>{message.message}</div>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex">
//                 <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 p-3 border rounded-lg" placeholder="Type a message..." />
//                 <button onClick={handleSendMessage} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">Send</button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorConnection;
