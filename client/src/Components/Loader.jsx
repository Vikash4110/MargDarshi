import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const circleVariants = {
    animate: {
      rotate: 360,
      transition: { duration: 2, repeat: Infinity, ease: "linear" },
    },
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="relative flex items-center justify-center w-36 h-36">
        <motion.div
          className="absolute w-32 h-32 rounded-full border-4 border-t-teal-600 border-teal-200"
          variants={circleVariants}
          animate="animate"
        />
        
        {/* Dots rotating around */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-teal-600 rounded-full"
          variants={dotVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-teal-600 rounded-full"
          variants={dotVariants}
          animate="animate"
          transition={{ delay: 0.2 }}
        />
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-teal-600 rounded-full"
          variants={dotVariants}
          animate="animate"
          transition={{ delay: 0.4 }}
        />
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-teal-600 rounded-full"
          variants={dotVariants}
          animate="animate"
          transition={{ delay: 0.6 }}
        />

        {/* Centered text inside the circle */}
        <motion.div
          className="absolute text-teal-600 text-lg font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
        >
          Margdarshi
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Loader;
