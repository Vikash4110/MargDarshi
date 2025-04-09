import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.2, ease: "easeOut" },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, rotate: -10 },
    visible: {
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.5, delay: 0.3, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.5, ease: "easeOut" },
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" },
    },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 px-6 py-12"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
      initial="hidden"
    >
      <motion.div
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icon */}
        <motion.div
          className="mb-6"
          variants={iconVariants}
          initial="hidden"
          animate="visible"
        >
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-[#0f6f5c] text-5xl"
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight"
          variants={textVariants}
        >
          404
        </motion.h1>

        {/* Subheading */}
        <motion.h2
          className="text-xl font-semibold text-[#0f6f5c] mb-4 tracking-tight"
          variants={textVariants}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-gray-600 mb-6 text-sm font-sans leading-relaxed tracking-tight"
          variants={textVariants}
        >
          It appears you’ve ventured off course. The page you’re seeking may have been relocated or doesn’t exist. Let’s get you back on track.
        </motion.p>

        {/* Back to Home Button */}
        <motion.button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white px-6 py-2.5 rounded-full font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Return to Home
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;