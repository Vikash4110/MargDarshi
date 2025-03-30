import React, { useState } from "react";
import Hero from "../Components/homeHero";
import SectionWhy from "../Components/SectionWhy";
import Section2 from "../Components/Section2";
import Section3 from "../Components/Section3";
import Section4 from "../Components/Section4";
import Section5 from "../Components/Section5";
import Section6 from "../Components/Section6";
import Section7 from "../Components/Section7";
import Footer from "../Components/Footer";
import { FaCommentDots } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"; 
import ChatBot from "../pages/ChatBot"; 
import MenteeB from "../Components/MenteeB";
import HeroStart from '../Components/HeroStart'
import ScrollingFeatureStrap from '../Components/ScrollingFeatureStrap'

const Home = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <>
    <div className=" bg-gradient-to-br from-gray-50 to-teal-50 ">
    {/* <HeroStart/> */}
      {/* Hero Section with AOS */}
      <div data-aos="fade-up" >
        <ScrollingFeatureStrap />
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <Hero />
      </div>

      {/* SectionWhy with AOS */}
      <div data-aos="fade-up" data-aos-delay="100">
        <SectionWhy />
      </div>

      {/* Section2 with AOS */}
      <div data-aos="fade-up" data-aos-delay="200">
        <Section2 />
      </div>

      {/* Section3 with AOS */}
      <div data-aos="fade-up" data-aos-delay="300">
        <Section3 />
      </div>

      {/* Section4 with AOS */}
      <div data-aos="fade-up" data-aos-delay="400">
        <Section4 />
      </div>

      {/* Section5 with AOS */}
      <div data-aos="fade-up" data-aos-delay="500">
        <Section5 />
      </div>

      {/* Section6main with AOS */}
      <div data-aos="fade-up" data-aos-delay="600">
        <Section6 />
      </div>

      {/* Section7 with AOS */}
      <div data-aos="fade-up" data-aos-delay="700">
        <Section7 />
      </div>

      {/* MenteeB with AOS */}
      {/* <div data-aos="fade-up" data-aos-delay="740">
        <MenteeB />
      </div> */}

      {/* Footer with AOS */}
      <div data-aos="fade-up" data-aos-delay="780">
        <Footer />
      </div>

      {/* Chatbot Icon */}
      <motion.div
        className="fixed bottom-8 right-8 z-50 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => setIsChatbotOpen(true)}
      >
        <div className="bg-gradient-to-r from-[#0f6f5c] to-teal-500  text-white p-4 rounded-full shadow-lg hover:from-teal-600 hover:to-teal-700 transition duration-300">
          <FaCommentDots className="text-2xl" />
        </div>
      </motion.div>

      {/* Chatbot Component */}
      {isChatbotOpen && <ChatBot onClose={() => setIsChatbotOpen(false)} />}
      </div>
    </>
    
  );
};

export default Home;