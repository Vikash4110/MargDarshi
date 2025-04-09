import React from "react";
import { motion } from "framer-motion";
import { FaHandshake, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

const Loader = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    }
  };

  const orbit = {
    animate: {
      rotate: 360,
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const icon = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: [1, 1.2, 1],
      opacity: 1,
      transition: {
        delay: i * 0.3,
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    })
  };

  const logo = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const icons = [
    { component: <FaHandshake className="text-blue-500 text-xl" />, color: "bg-blue-100" },
    { component: <FaUserGraduate className="text-indigo-500 text-xl" />, color: "bg-indigo-100" },
    { component: <FaChalkboardTeacher className="text-teal-500 text-xl" />, color: "bg-teal-100" }
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 backdrop-blur-sm"
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="relative w-48 h-48 mb-8">
        {/* Central logo with subtle pulse */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={logo}
          animate="pulse"
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md"
            variants={logo}
          >
            <span className="text-white text-xl font-bold">MC</span>
          </motion.div>
        </motion.div>

        {/* Orbiting mentor icons */}
        <motion.div
          className="absolute inset-0"
          variants={orbit}
          animate="animate"
        >
          {icons.map((item, i) => (
            <motion.div
              key={i}
              className={`absolute w-8 h-8 ${item.color} rounded-full flex items-center justify-center shadow-sm`}
              style={{
                top: "0%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
              custom={i}
              variants={icon}
            >
              {item.component}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Text content with fade animation */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.9, 1, 0.9],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          MentorConnect
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Bridging knowledge and experience
        </p>
      </motion.div>

      {/* Animated progress bar */}
      <motion.div
        className="mt-8 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 0.5 }
        }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{
            width: "100%",
            transition: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Loader;