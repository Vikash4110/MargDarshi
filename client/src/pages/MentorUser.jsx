import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { motion, AnimatePresence } from "framer-motion";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import { IoBriefcase, IoPerson, IoCalendar, IoCode, IoChatbubbles, IoTime } from "react-icons/io5"; // Added React Icons
import { Link } from "react-router-dom";

const MentorUser = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { authorizationToken } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(`${backendUrl}/api/auth/mentor-user`, {
          method: "GET",
          headers: {
            Authorization: authorizationToken,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch mentor details");

        const data = await response.json();
        setMentor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, []);

  if (loading) {
    return (
      <motion.p
        className="text-center text-lg text-gray-700"
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
        className="text-red-500 text-center text-lg"
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
        className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left Column - Profile Image and Basic Info */}
          <motion.div
            className="col-span-1 flex flex-col items-center md:items-start"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.img
              src={mentor.profilePicture || "https://via.placeholder.com/150"}
              alt="Mentor"
              className="w-48 h-48 rounded-full shadow-lg object-cover border-4 border-teal-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            />
            <motion.h2
              className="text-3xl font-extrabold mt-6 text-[#0f6f5c] tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {mentor.fullName || "N/A"}
            </motion.h2>
            <motion.div
              className="flex items-center font-bold mt-2 text-lg text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <IoBriefcase className="mr-2 text-teal-600" /> {mentor.jobTitle || "Job title not available"}
            </motion.div>
            <motion.div
              className="flex items-center font-bold  mt-1 text-lg text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <IoCalendar className="mr-2 text-teal-600" /> {mentor.company || "Company not available"}
            </motion.div>
            <motion.div
              className="flex items-center font-bold mt-1 text-lg text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <IoCalendar className="mr-2 text-teal-600" /> {mentor.yearsOfExperience || 0} years of experience
            </motion.div>
          </motion.div>

          {/* Middle Column - About, Skills, Mentorship Topics, Availability, Social Media */}
          <motion.div
            className="col-span-2"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            {/* About Section */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center tracking-tight">
                <IoPerson className="mr-2 text-teal-600" /> About Me
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {mentor.bio || "No bio available."}
              </p>
            </motion.div>

            {/* Skills Section */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center tracking-tight">
                <IoCode className="mr-2 text-teal-600" /> Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {mentor.skills?.length ? (
                  mentor.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm shadow-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {skill}
                    </motion.span>
                  ))
                ) : (
                  <span className="text-gray-500">No skills listed</span>
                )}
              </div>
            </motion.div>

            {/* Mentorship Topics Section (Now styled like Skills) */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center tracking-tight">
                <IoChatbubbles className="mr-2 text-teal-600" /> Mentorship Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {mentor.mentorshipTopics?.length ? (
                  mentor.mentorshipTopics.map((topic, index) => (
                    <motion.span
                      key={index}
                      className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm shadow-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {topic}
                    </motion.span>
                  ))
                ) : (
                  <span className="text-gray-500">No mentorship topics available</span>
                )}
              </div>
            </motion.div>

            {/* Availability Section */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center tracking-tight">
                <IoTime className="mr-2 text-teal-600" /> Availability
              </h2>
              <ul className="list-disc list-inside text-gray-700">
                {mentor.availability?.length ? (
                  mentor.availability.map((slot, index) => (
                    <motion.li
                      key={index}
                      className="mb-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        {slot.day} - {slot.time}
                      </span>
                    </motion.li>
                  ))
                ) : (
                  <li className="text-gray-500">No availability listed</li>
                )}
              </ul>
            </motion.div>

            {/* Social Media Section */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center tracking-tight">
                <IoPerson className="mr-2 text-teal-600" /> Social Media
              </h2>
              <div className="flex gap-4">
                {mentor.linkedInUrl ? (
                  <motion.a
                    href={mentor.linkedInUrl}
                    target="_blank"
                    className="text-blue-600 text-2xl hover:text-blue-800 transition duration-200"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaLinkedin />
                  </motion.a>
                ) : (
                  <span className="text-gray-500">LinkedIn not available</span>
                )}

                {mentor.socialMedia?.twitter ? (
                  <motion.a
                    href={mentor.socialMedia.twitter}
                    target="_blank"
                    className="text-blue-400 text-2xl hover:text-blue-600 transition duration-200"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaTwitter />
                  </motion.a>
                ) : (
                  <span className="text-gray-500">Twitter not available</span>
                )}

                {mentor.socialMedia?.github ? (
                  <motion.a
                    href={mentor.socialMedia.github}
                    target="_blank"
                    className="text-gray-900 text-2xl hover:text-gray-700 transition duration-200"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaGithub />
                  </motion.a>
                ) : (
                  <span className="text-gray-500">GitHub not available</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Edit Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.button
            className="bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-teal-600 hover:to-teal-700 focus:outline-none transition duration-300 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/mentor-update">Edit Mentor Details</Link>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MentorUser;