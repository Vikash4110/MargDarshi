import React, { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoPerson,
  IoMail,
  IoCall,
  IoSchool,
  IoBriefcase,
  IoCompass,
  IoCode,
  IoChatbox,
  IoTime,
} from "react-icons/io5"; // Updated to remove IoLink
import { FaLinkedin } from "react-icons/fa"; // Added FaLinkedin for LinkedIn link

const MenteeProfile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();

  const [mentee, setMentee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenteeDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/auth/mentee-user`, {
          method: "GET",
          headers: {
            Authorization: authorizationToken,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch mentee details");
        }

        const data = await response.json();
        setMentee(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching mentee details");
        setLoading(false);
      }
    };

    fetchMenteeDetails();
  }, [authorizationToken]);

  if (loading) {
    return (
      <motion.p
        className="text-center text-lg font-semibold text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading...
      </motion.p>
    );
  }

  if (error) {
    return (
      <motion.p
        className="text-red-500 text-center text-lg font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {error}
      </motion.p>
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

  // Section animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 p-4 lg:p-8 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      <motion.div
        className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          className="text-3xl font-extrabold text-[#0f6f5c] text-center mb-8 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Mentee Profile
        </motion.h2>

        {/* Edit Button (Inside the box, top-right) */}
        <motion.div
          className="absolute top-8 right-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link
            to="/mentee-update"
            className="bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white font-semibold px-4 py-2 rounded-xl hover:from-teal-600 hover:to-teal-700 transition duration-300 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit Profile
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left Column - Profile Image */}
          <motion.div
            className="col-span-1 flex flex-col items-center md:items-start"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            {mentee.profilePicture && (
              <motion.img
                src={mentee.profilePicture}
                alt="Profile"
                className="w-48 h-48 rounded-full border-4 border-teal-500 mb-6 shadow-lg object-cover"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              />
            )}
          </motion.div>

          {/* Right Column - Information */}
          <motion.div
            className="col-span-2"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Basic Info */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.h3
                className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <IoPerson className="mr-2 text-teal-600" /> {mentee.fullName}
              </motion.h3>
              <motion.p
                className="text-gray-500 text-sm mb-2 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <IoMail className="mr-2 text-teal-600" /> {mentee.email}
              </motion.p>
              <motion.p
                className="text-gray-600 text-sm flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <IoCall className="mr-2 text-teal-600" /> {mentee.phoneNumber}
              </motion.p>
            </motion.div>

            {/* Education Details */}
            <motion.div
              className="mb-6 bg-gray-50 p-6 rounded-xl shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                <IoSchool className="mr-2 text-teal-600" /> Education
              </h4>
              <p className="text-gray-700">
                <strong className="text-gray-800">University:</strong> {mentee.universityName || "Not specified"}
              </p>
              <p className="text-gray-700 mt-2">
                <strong className="text-gray-800">Field of Study:</strong> {mentee.fieldOfStudy || "Not specified"}
              </p>
              <p className="text-gray-700 mt-2">
                <strong className="text-gray-800">Graduation Year:</strong> {mentee.expectedGraduationYear || "Not specified"}
              </p>
            </motion.div>

            {/* Career Interests */}
            <motion.div
              className="mb-6 bg-gray-50 p-6 rounded-xl shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                <IoBriefcase className="mr-2 text-teal-600" /> Career Interests
              </h4>
              <p className="text-gray-700">
                {mentee.careerInterests?.join(", ") || "Not specified"}
              </p>
            </motion.div>

            {/* Desired Industry */}
            <motion.div
              className="mb-6 bg-gray-50 p-6 rounded-xl shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                <IoCompass className="mr-2 text-teal-600" /> Desired Industry
              </h4>
              <p className="text-gray-700">
                {mentee.desiredIndustry?.join(", ") || "Not specified"}
              </p>
            </motion.div>

            {/* Skills to Develop */}
            <motion.div
              className="mb-6 bg-gray-50 p-6 rounded-xl shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                <IoCode className="mr-2 text-teal-600" /> Skills to Develop
              </h4>
              <p className="text-gray-700">
                {mentee.skillsToDevelop?.join(", ") || "Not specified"}
              </p>
            </motion.div>

            {/* Mentorship Preferences */}
            <motion.div
              className="mb-6 bg-gray-50 p-6 rounded-xl shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                <IoChatbox className="mr-2 text-teal-600" /> Mentorship Preferences
              </h4>
              <p className="text-gray-700">
                <strong className="text-gray-800">Type:</strong> {mentee.typeOfMentorshipSought?.join(", ") || "Not specified"}
              </p>
              <p className="text-gray-700 mt-2">
                <strong className="text-gray-800">Preferred Mode:</strong> {mentee.preferredMentorshipMode || "Not specified"}
              </p>
              <p className="text-gray-700 mt-2">
                <strong className="text-gray-800">Preferred Days & Times:</strong> {mentee.preferredDaysAndTimes?.join(", ") || "Not specified"}
              </p>
            </motion.div>

           
            {/* Personal Introduction */}
            <motion.div
              className="mt-6 bg-gray-100 p-6 rounded-xl shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                <IoChatbox className="mr-2 text-teal-600" /> Personal Introduction
              </h4>
              <p className="text-gray-600">
                {mentee.personalIntroduction || "Not provided"}
              </p>
            </motion.div>

 {/* Personal Introduction */}
 <motion.div
              className="mt-6 bg-gray-100 p-6 rounded-xl shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                <IoChatbox className="mr-2 text-teal-600" /> Social Links
              </h4>
              <motion.a
                  href={mentee.linkedInProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-semibold flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaLinkedin className="mr-2 text-blue-600 text-2xl hover:text-blue-800 transition duration-200" />
                </motion.a>
            </motion.div>
           

          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MenteeProfile;