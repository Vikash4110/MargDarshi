import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaBriefcase, FaIndustry, FaUser } from "react-icons/fa";
import Img from "../assets/profile2.jpg"; // Default profile picture
import VideoConference from "../pages/VideoConference";

const MenteeAcceptedReq = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [acceptedMentors, setAcceptedMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomID, setRoomID] = useState(null);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const { authorizationToken } = useAuth();

  useEffect(() => {
    fetchAcceptedMentors();
  }, []);

  const fetchAcceptedMentors = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${backendUrl}/api/auth/mentee-connected-mentors`,
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
      setAcceptedMentors(data.connectedMentors);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCall = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomID = urlParams.get("roomID");

    if (roomID) {
      setRoomID(roomID);
      setIsCallStarted(true);
    } else {
      toast.error("No meeting link found.");
    }
  };

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
          onClick={fetchAcceptedMentors}
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
        Accepted Mentors
      </h1>

      {/* Mentor List */}
      {isCallStarted ? (
        <VideoConference roomID={roomID} userID="mentee" userName="Mentee" />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {acceptedMentors.map((mentor) => (
            <motion.div
              key={mentor._id}
              className="bg-white p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
              whileHover={{ scale: 1.03 }}
            >
              {/* Profile Picture */}
              <div className="w-24 h-24 mx-auto">
                <img
                  src={Img} // Replace with mentor.profilePicture if available
                  alt={mentor.fullName}
                  className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-md"
                />
              </div>

              {/* Mentor Name */}
              <h2 className="mt-4 text-xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                {mentor.fullName}
              </h2>

              {/* Mentor Details */}
              <div className="text-gray-600 mt-2 space-y-2">
                <div className="flex items-center">
                  <FaEnvelope className="text-blue-500 mr-2" />
                  <p>{mentor.email}</p>
                </div>
                <div className="flex items-center">
                  <FaBriefcase className="text-green-500 mr-2" />
                  <p>{mentor.jobTitle}</p>
                </div>
                <div className="flex items-center">
                  <FaIndustry className="text-purple-500 mr-2" />
                  <p>{mentor.industry}</p>
                </div>
                <div className="flex items-center">
                  <FaUser className="text-pink-500 mr-2" />
                  <p>{mentor.yearsOfExperience} years of experience</p>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={handleJoinCall}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  Join Video Call
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MenteeAcceptedReq;