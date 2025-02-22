import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { IoPerson } from "react-icons/io5"; // Added React Icon for mentee representation
import Img from "../assets/mentee.png";
import "../App.css";

const MenteeA = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();

  const [mentee, setMentee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const platformName = "MargDakshi";
  const quote = "The beautiful thing about learning is that no one can take it away from you.";
  const subheading = "Empower your journey with personalized mentorship.";

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
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMenteeDetails();
  }, [authorizationToken, backendUrl]);

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

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Image animation variants
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  // Button animation variants
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden "
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      {/* Subtle Gradient Background (now handled by bgVariants) */}
      <div className="absolute inset-0 z-0"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative container mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10 z-10"
      >
        {/* Left Side: Content */}
        <motion.div
          className="flex-1 space-y-6 text-center md:text-left max-w-lg"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Dynamic Greeting */}
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" /> Loading...
              </span>
            ) : error ? (
              "Welcome, Mentee!"
            ) : (
              <>
                Welcome to <span className="text-[#127C71]">{platformName}</span>,{" "}
                <span className="bg-gradient-to-r from-[#127C71] to-teal-500 bg-clip-text text-transparent">
                  {mentee?.fullName || "Mentee"}
                </span>
                !
              </>
            )}
          </motion.h1>

          {/* Subheading with Icon */}
          <motion.p
            className="text-lg text-gray-600 font-bold flex items-center justify-center md:justify-start gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <IoPerson className="text-[#127C71] text-xl" /> {subheading}
          </motion.p>

          {/* Quote */}
          <motion.blockquote
            className="text-md font-semibold text-gray-500 italic border-l-4 border-teal-500 pl-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            "{quote}"
          </motion.blockquote>

          {/* Call-to-Action Button */}
          <motion.button
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#127C71] to-teal-500 text-white font-semibold rounded-xl shadow-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300"
          >
            <FaSearch />
          <Link to="/mentors"><span>Find Your Mentor</span></Link>  
          </motion.button>
        </motion.div>

        {/* Right Side: Image */}
        <motion.div
          className="flex-1 flex justify-center"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.img
            src={Img}
            alt="Mentee Dashboard Illustration"
            className="w-full max-w-md h-auto  transform hover:scale-105 transition-transform duration-300"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default MenteeA;