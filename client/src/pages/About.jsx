import { useState } from "react";
import { motion } from "framer-motion";
import Img from "../assets/bg.png"; // About Us Image
import FutureScopeImg from "../assets/couple-playing-with-virtual-reality.png"; // Future Scope Image
import DevImg from "../assets/Anjali.jpg"; // Developer Placeholder Image

const About = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 py-12 md:px-20">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-10 text-[#127C71]">About Us</h1>

      {/* Scroll Bars */}
      <div className="flex justify-center gap-4 mb-10">
        <div className="w-24 h-1 bg-gray-300 rounded-lg"></div>
        <div className="w-24 h-1 bg-gray-400 rounded-lg"></div>
        <div className="w-24 h-1 bg-gray-500 rounded-lg"></div>
      </div>

      {/* Main Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left Side - SVG Image */}
        <div>
          <img src={Img} alt="About Us" className="w-full h-auto" />
        </div>

        {/* Right Side - Features */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-[#127C71] mb-4">Features</h2>

          {[
            { title: "Personalized Matching", content: "Uses advanced algorithms to match mentors and mentees based on goals, skills, interests, and expertise." },
            { title: "Communication Tools", content: "Provides seamless communication channels like messaging, video calls, or scheduling tools." },
            { title: "Resource Sharing", content: "Enables mentors to share study materials, advice, and feedback to support mentees' development." },
          ].map((feature, index) => (
            <div key={index} className="border border-gray-700 rounded-lg p-4">
              <button
                onClick={() => toggleSection(index)}
                className="w-full text-left font-semibold flex justify-between items-center text-black"
              >
                {feature.title}
                <span>{openSection === index ? "▲" : "▼"}</span>
              </button>
              {openSection === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 text-gray-600"
                >
                  {feature.content}
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Future Scope Section */}
      <div className="mt-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-semibold text-[#127C71]">Future Scope</h2>
          <div className="mt-4 text-lg text-black space-y-2 text-left">
            <p><strong>AI-Powered Mentor Matching:</strong> Uses AI to connect students with the right mentors.</p>
            <p><strong>Live Webinars & Workshops:</strong> Hosts interactive sessions with industry experts.</p>
            <p><strong>Gamification & Rewards:</strong> Implements a point-based system to encourage mentorship activities.</p>
            <p><strong>Internship & Job Opportunities:</strong> Provides job and internship listings with mentor referrals.</p>
            <p><strong>Blockchain-Based Certification:</strong> Issues verified digital certificates.</p>
            <p><strong>Community Building & Networking:</strong> Creates discussion forums for collaboration.</p>
            <p><strong>Mobile App Development:</strong> Expands accessibility with an Android & iOS app.</p>
            <p><strong>AI-Based Career Guidance Chatbot:</strong> Offers instant career guidance.</p>
          </div>
        </div>
        <div className="flex justify-center">
          <img src={FutureScopeImg} alt="Future Scope" className="w-3/4 h-auto" />
        </div>
      </div>

      {/* Developed By Section */}
      <div className="mt-16">
        <h2 className="text-4xl font-bold text-[#127C71] text-center mb-8">Developed By</h2>

        <div className="grid md:grid-cols-4 gap-10">
          {[
            { name: "Vikash Bharal", img: DevImg },
            { name: "Ujjwal", img: DevImg },
            { name: "Sneha Gupta", img: DevImg },
            { name: "Anjali", img: DevImg },
          ].map((dev, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white shadow-lg rounded-lg overflow-hidden text-center p-6 border border-gray-200 transition duration-300"
            >
              <img src={dev.img} alt={dev.name} className="w-40 h-40 mx-auto rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-[#127C71]">{dev.name}</h3>
              <p className="text-gray-600 text-lg">B.Tech CSE (3rd Year)</p>
              <p className="text-gray-500 text-sm">Punjab Technical University</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;