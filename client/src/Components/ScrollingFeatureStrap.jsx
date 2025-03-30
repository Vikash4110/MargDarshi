import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  FaUserFriends, 
  FaCalendarAlt, 
  FaBriefcase, 
  FaChartLine, 
  FaClipboardCheck,
  FaHandshake,
  FaLightbulb,
  FaNetworkWired
} from 'react-icons/fa';
import { IoMdRocket } from 'react-icons/io';
import { GiSkills, GiProgression } from 'react-icons/gi';
import { MdOutlineWorkspacePremium } from 'react-icons/md';

const ScrollingFeaturesStrap = () => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const features = [
    {
      icon: <FaUserFriends className="text-3xl text-[#127C71]" />,
      title: "Smart Matching",
      description: "AI-powered mentor-mentee compatibility"
    },
    {
      icon: <FaCalendarAlt className="text-3xl text-[#127C71]" />,
      title: "Easy Scheduling",
      description: "Seamless session booking"
    },
    {
      icon: <FaBriefcase className="text-3xl text-[#127C71]" />,
      title: "Job Opportunities",
      description: "Exclusive career openings"
    },
    {
      icon: <FaChartLine className="text-3xl text-[#127C71]" />,
      title: "Mentor Insights",
      description: "Data-driven guidance"
    },
    {
      icon: <GiSkills className="text-3xl text-[#127C71]" />,
      title: "Skill Assessment",
      description: "Personalized evaluations"
    },
    {
      icon: <IoMdRocket className="text-3xl text-[#127C71]" />,
      title: "Career Growth",
      description: "Accelerate your development"
    },
    {
      icon: <FaHandshake className="text-3xl text-[#127C71]" />,
      title: "Networking",
      description: "Connect with professionals"
    },
    {
      icon: <FaLightbulb className="text-3xl text-[#127C71]" />,
      title: "Expert Advice",
      description: "Industry-specific knowledge"
    },
    {
      icon: <GiProgression className="text-3xl text-[#127C71]" />,
      title: "Progress Tracking",
      description: "Monitor your improvement"
    },
    {
      icon: <MdOutlineWorkspacePremium className="text-3xl text-[#127C71]" />,
      title: "Premium Resources",
      description: "Exclusive learning materials"
    },
    {
      icon: <FaNetworkWired className="text-3xl text-[#127C71]" />,
      title: "Community",
      description: "Join like-minded peers"
    }
  ];

  // Duplicate the array to create seamless looping
  const duplicatedFeatures = [...features, ...features];

  return (
    <div 
      className="relative bg-gradient-to-r from-[#f0fdfa] to-[#ecfdf5] py-5 overflow-hidden border-y border-gray-200"
      onMouseEnter={() => {
        setIsHovered(true);
        controls.start({ x: '-100%' });
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        controls.start({
          x: ['0%', '-100%'],
          transition: {
            x: {
              repeat: Infinity,
              duration: 40,
              ease: 'linear'
            }
          }
        });
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none" />
      
      <motion.div
        className="flex whitespace-nowrap"
        animate={controls}
        initial={{
          x: ['0%', '-100%'],
          transition: {
            x: {
              repeat: Infinity,
              duration: 40,
              ease: 'linear'
            }
          }
        }}
      >
        {duplicatedFeatures.map((feature, index) => (
          <motion.div 
            key={index}
            className="inline-flex items-center mx-6 px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-100"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.3 }
            }}
          >
            <div className="mr-4">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Gradient fade effect */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#f0fdfa] to-transparent z-20" />
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#f0fdfa] to-transparent z-20" />
    </div>
  );
};

export default ScrollingFeaturesStrap;