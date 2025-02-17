import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaPhone, FaGraduationCap, FaUniversity, FaBook } from "react-icons/fa";
import Img from "../assets/profile2.jpg"; // Default profile picture
import VideoConference from "../pages/VideoConference";

const MentorConnection = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [connectedMentees, setConnectedMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roomID, setRoomID] = useState(null);
  const [isCallStarted, setIsCallStarted] = useState(false);
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

  const handleStartCall = (mentee) => {
    const roomID = `room-${mentee._id}-${Date.now()}`; // Generate a unique room ID
    setRoomID(roomID);
    setIsCallStarted(true);

    // Send the meeting link to the mentee (you can use a notification system or email)
    const meetingLink = `${window.location.origin}/video-call?roomID=${roomID}`;
    toast.info(`Meeting link sent to ${mentee.fullName}: ${meetingLink}`);
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
    <div className="p-6">
      <ToastContainer />

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-6">
        Connected Mentees
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Mentee List */}
      {isCallStarted ? (
        <VideoConference roomID={roomID} userID="mentor" userName="Mentor" />
      ) : (
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
              {/* Profile Picture */}
              <div className="w-24 h-24 mx-auto">
                <img
                  src={Img} // Replace with mentee.profilePicture if available
                  alt={mentee.fullName}
                  className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-md"
                />
              </div>

              {/* Mentee Name */}
              <h2 className="mt-4 text-xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                {mentee.fullName}
              </h2>

              {/* Mentee Details */}
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

              {/* Call-to-Action Buttons */}
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={() => handleStartCall(mentee)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  Start Video Call
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MentorConnection;