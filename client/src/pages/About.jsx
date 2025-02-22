import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoBulb, IoChatbubbleEllipses, IoDocumentText, IoRocket, IoPeople, IoPhonePortrait, IoShieldCheckmark, IoChatbox, IoBriefcase, IoPerson } from "react-icons/io5"; // Added React Icons
import Img from "../assets/vecteezy_3d-male-character-sitting-on-a-sofa-and-working-on-a-laptop_24785818.png"; // About Us Image
import FutureScopeImg from "../assets/vecteezy_hands-using-a-smartphone-and-registering-online_8258613.svg"; // Future Scope Image
import DevImg from "../assets/profile2.jpg"; // Developer Placeholder Image
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS styles

const About = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

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
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  // Card animation variants for developers and future scope
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 text-black px-6 py-12 md:px-20 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      {/* Heading */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-[#127C71] text-center mb-10 tracking-tight"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        About Us
      </motion.h1>

      {/* Scroll Bars (Animated with AOS) */}
      <div
        className="flex justify-center gap-4 mb-10"
        data-aos="fade-up"
      >
        <div className="w-24 h-1 bg-gray-300 rounded-lg"></div>
        <div className="w-24 h-1 bg-gray-400 rounded-lg"></div>
        <div className="w-24 h-1 bg-gray-500 rounded-lg"></div>
      </div>

      {/* Main Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - SVG Image (Animated with AOS) */}
        <motion.div
          className="order-2 md:order-1"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          data-aos="fade-right"
        >
          <img
            src={Img}
            alt="About Us"
            className="w-full h-auto rounded-xl object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </motion.div>

        {/* Right Side - Features */}
        <motion.div
          className="order-1 md:order-2 space-y-6"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          data-aos="fade-left"
        >
          <h2 className="text-3xl font-semibold text-[#127C71] flex items-center gap-2">
            <IoBulb className="text-teal-500" /> Features
          </h2>

          {[
            { title: "Personalized Matching", content: "Uses advanced algorithms to match mentors and mentees based on goals, skills, interests, and expertise.", icon: IoChatbubbleEllipses },
            { title: "Communication Tools", content: "Provides seamless communication channels like messaging, video calls, or scheduling tools.", icon: IoChatbox },
            { title: "Resource Sharing", content: "Enables mentors to share study materials, advice, and feedback to support mentees' development.", icon: IoDocumentText },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="border border-gray-200 rounded-xl p-6 bg-white hover:bg-teal-50 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full text-left font-semibold text-gray-800 flex justify-between items-center gap-2"
              >
                <feature.icon className="text-teal-500" />
                {feature.title}
                <span>{openSection === index ? "▲" : "▼"}</span>
              </button>
              {openSection === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-gray-600 text-lg"
                >
                  {feature.content}
                </motion.p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Future Scope Section (Restructured and Professionalized) */}
      <motion.div
        className="mt-16 grid md:grid-cols-2 gap-12 items-center"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        data-aos="fade-up"
      >
        <motion.div
          className="space-y-6"
          data-aos="fade-right"
        >
          <h2 className="text-3xl font-semibold text-[#127C71] flex items-center gap-2">
            <IoRocket className="text-teal-500" /> Future Scope
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "AI-Powered Mentor Matching", content: "Uses AI to connect students with the right mentors.", icon: IoBulb },
              { title: "Live Webinars & Workshops", content: "Hosts interactive sessions with industry experts.", icon: IoChatbox },
              { title: "Gamification & Rewards", content: "Implements a point-based system to encourage mentorship activities.", icon: IoShieldCheckmark },
              { title: "Internship & Job Opportunities", content: "Provides job and internship listings with mentor referrals.", icon: IoBriefcase },
              { title: "Blockchain-Based Certification", content: "Issues verified digital certificates.", icon: IoDocumentText },
              { title: "Community Building & Networking", content: "Creates discussion forums for collaboration.", icon: IoPeople },
              { title: "Mobile App Development", content: "Expands accessibility with an Android & iOS app.", icon: IoPhonePortrait },
              { title: "AI-Based Career Guidance Chatbot", content: "Offers instant career guidance.", icon: IoChatbubbleEllipses },
            ].map((scope, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:bg-teal-50 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-center gap-3">
                  <scope.icon className="text-teal-500 text-2xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{scope.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{scope.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="flex justify-center"
          data-aos="fade-left"
        >
          <img
            src={FutureScopeImg}
            alt="Future Scope"
            className="w-3/4 h-auto rounded-xl object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
      </motion.div>

      {/* Developed By Section */}
      <motion.div
        className="mt-16"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        data-aos="fade-up"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#127C71] text-center mb-12 tracking-tight">Developed By</h2>

        <motion.div
          className="grid md:grid-cols-4 gap-10"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {[
            { name: "Vikash Bharal", img: DevImg },
            { name: "Ujjwal", img: DevImg },
            { name: "Sneha Gupta", img: DevImg },
            { name: "Anjali", img: DevImg },
          ].map((dev, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-3xl overflow-hidden text-center p-6 border border-gray-100 transition duration-300 hover:bg-teal-50"
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              <motion.img
                src={dev.img}
                alt={dev.name}
                className="w-40 h-40 mx-auto rounded-xl object-cover mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <h3 className="text-xl font-bold text-[#127C71]">{dev.name}</h3>
              <p className="text-gray-600 text-lg">B.Tech CSE (3rd Year)</p>
              <p className="text-gray-500 text-sm">Punjab Technical University</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default About;