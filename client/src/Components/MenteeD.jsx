import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoRocketSharp, IoSparkles } from "react-icons/io5"; // Added IoSparkles for heading flair
import skillImage from "../assets/vecteezy_3d-male-character-sitting-on-a-sofa-and-working-on-a-laptop_24785818.png"; // Your image path

const SkillGo = () => {
  const quote = "Mastering skills is the key to unlocking your potential and shaping your future.";
  const subtext = "Elevate your abilities with tailored assessments.";
  const benefits = [
    "Identify your strengths and areas for growth.",
    "Boost your confidence with measurable progress.",
    "Enhance your employability and career prospects.",
    "Stay competitive in a fast-evolving job market.",
    "Personalize your learning journey with actionable insights.",
  ];

  return (
    <motion.div
      className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Left Side - Text Content */}
      <motion.div
        className="md:w-1/2 px-6 text-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Heading */}
        <motion.div
          className="flex items-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <IoSparkles className="text-4xl text-teal-500 mr-2" />
          <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
            Skill Assessment
          </h2>
        </motion.div>

        {/* Subtext */}
        <motion.p
          className="text-xl font-medium text-teal-600 mb-6 tracking-wide"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {subtext}
        </motion.p>

        {/* Quote */}
        <motion.p
          className="text-xl font-semibold text-gray-700 italic mb-6 leading-relaxed tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          "{quote}"
        </motion.p>

        {/* Benefits */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Assess Your Skills?</h3>
          <ul className="text-gray-600 space-y-3">
            {benefits.map((benefit, index) => (
              <motion.li
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              >
                <span className="text-teal-500 mr-3 text-lg">•</span>
                <span className="text-base font-medium">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <Link to="/skill-assessment">
            <motion.button
              className="flex items-center justify-center py-3 px-8 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-full shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoRocketSharp className="mr-2 text-lg" />
              <span className="text-lg font-semibold">Start Skill Assessment</span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Right Side - Image */}
      <motion.div
        className="md:w-1/2 mt-8 md:mt-0 px-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <img
          src={skillImage}
          alt="Skill Development Illustration"
          className="w-full max-w-md mx-auto object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </motion.div>
    </motion.div>
  );
};

export default SkillGo;