import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaBriefcase, FaIndustry, FaUser, FaTimes } from "react-icons/fa";
import Img from "../assets/profile2.jpg"; // Default profile picture
import Dash from "../pages/Dash";

const MenteeAcceptedReq = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [acceptedMentors, setAcceptedMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [calendlyLink, setCalendlyLink] = useState("");
  const { authorizationToken } = useAuth();

  useEffect(() => {
    fetchAcceptedMentors();

    // Load Calendly script dynamically
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => console.log("Calendly script loaded successfully.");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched Mentors Data:", data);
      setAcceptedMentors(data.connectedMentors);
    } catch (err) {
      console.error("Fetch Error:", err);
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

  if (loading) {
    return (
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
  }

  if (error) {
    return (
      <motion.div
        className="text-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-red-500 text-lg font-semibold">{error}</p>
        <motion.button
          onClick={fetchAcceptedMentors}
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition duration-300 shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry
        </motion.button>
      </motion.div>
    );
  }

  // Background animation variants
  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 p-8 overflow-hidden"
        variants={bgVariants}
        animate="animate"
        style={{ backgroundSize: "200% 200%" }}
      >
        {/* Page Title */}
        <motion.h1
          className="text-4xl font-extrabold text-[#127C71] text-center mb-8 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Connected Mentors with Me
        </motion.h1>

        {/* Mentor Cards */}
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
                {/* Decorative Top Gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f6f5c] to-teal-400" />

                {/* Profile Section */}
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
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">{mentor.fullName}</h2>
                    <p className="text-base font-bold text-gray-500 flex items-center">
                      <FaBriefcase className="mr-1 text-teal-600" /> {mentor.jobTitle}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="mt-6 space-y-4">
                  <p className="text-gray-700 flex items-center text-base">
                    <FaIndustry className="mr-2 text-teal-600" />{" "}
                    <span className="font-bold text-gray-800">Industry:</span> <span className="ml-1">{mentor.industry}</span>
                  </p>
                  <p className="text-gray-700 flex items-center text-base">
                    <FaUser className="mr-2 text-teal-600" />{" "}
                    <span className="font-bold text-gray-800">Experience:</span> <span className="ml-1">{mentor.yearsOfExperience} years</span>
                  </p>
                  <p className="text-gray-700 flex items-center text-base">
                    <FaEnvelope className="mr-2 text-teal-600" />{" "}
                    <span className="font-bold text-gray-800">Email:</span> <span className="ml-1">{mentor.email}</span>
                  </p>
                </div>

                {/* Action Button */}
                <motion.button
                  onClick={() => handleScheduleMeeting(mentor)}
                  className="mt-6 w-full py-3 rounded-lg font-semibold text-white shadow-md transition duration-300 bg-gradient-to-r from-[#0f6f5c] to-teal-500 hover:from-teal-600 hover:to-teal-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Schedule Meeting
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Calendly Full-Screen Modal */}
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
      </motion.div>
    </>
  );
};

export default MenteeAcceptedReq;