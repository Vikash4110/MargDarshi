import React from "react";
import { AiOutlineCalendar, AiOutlineRobot, AiOutlineVideoCamera } from "react-icons/ai"; // Importing icons from react-icons
import { motion } from "framer-motion"; // Added for animations

const features = [
  {
    icon: <AiOutlineCalendar className="w-12 h-12 text-[#127C71]" />,
    title: "Automated Calendar Booking",
    description: "Easily schedule and manage meetings with automated calendar integration.",
  },
  {
    icon: <AiOutlineRobot className="w-12 h-12 text-[#127C71]" />,
    title: "AI-Based Mentor Matching",
    description: "Connect with the most suitable mentors using our intelligent AI matching system.",
  },
  {
    icon: <AiOutlineVideoCamera className="w-12 h-12 text-[#127C71]" />,
    title: "Video Calling",
    description: "Engage in seamless video calls for a more interactive mentoring experience.",
  },
];

const WhyMargDarshi = () => {
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

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      id="why-margdarshi"
      className="bg-gradient-to-br from-gray-50 to-teal-50  py-12 md:py-16 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-center mb-8 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="relative text-gray-800">
            Why <span className="text-[#127C71] font-extrabold">MentorConnect</span>?
            <svg className="absolute -top-3 -right-8 w-6 md:w-8 h-auto" viewBox="0 0 3183 3072">
              <path fill="#127C71" d="M2600 224c0,0 0,0 0,0 236,198 259,562 52,809 -254,303 -1849,2089 -2221,1776 -301,-190 917,-1964 1363,-2496 207,-247 570,-287 806,-89z" />
              <path fill="#127C71" d="M3166 2190c0,0 0,0 0,0 64,210 -58,443 -270,516 -260,90 -1848,585 -1948,252 -104,-230 1262,-860 1718,-1018 212,-73 437,39 500,250z" />
              <path fill="#127C71" d="M566 3c0,0 0,0 0,0 -219,-26 -427,134 -462,356 -44,271 -255,1921 90,1962 245,62 628,-1392 704,-1869 36,-221 -114,-424 -332,-449z" />
            </svg>
          </span>
        </motion.h2>
        <motion.div
          className="flex flex-col md:flex-row justify-center gap-8 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hover:border-teal-500 hover:shadow-xl transiton-all duration-300 transform hover:-translate-y-2 max-w-sm mx-auto md:mx-0"
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold text-[#127C71] mb-2 tracking-tight">{feature.title}</h3>
              <p className="text-gray-600 font-medium text-base md:text-lg leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhyMargDarshi;