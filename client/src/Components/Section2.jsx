import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import sliderImg from "../assets/sliderImage.jpg";
import "./Slider.css"; // Ensure custom styles are in the appropriate file
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { motion } from "framer-motion"; // Added for animations
import { IoPerson, IoBriefcase, IoCalendar, IoCode } from "react-icons/io5"; // Added more icons for additional data

// Custom next and previous button components
const NextArrow = ({ onClick }) => (
  <motion.div
    className="custom-next-arrow"
    style={{
      position: "absolute",
      bottom: "-70px",
      right: "30px",
      zIndex: 2,
      cursor: "pointer",
    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <FaArrowRightLong className="text-white text-2xl" />
  </motion.div>
);

const PrevArrow = ({ onClick }) => (
  <motion.div
    className="custom-prev-arrow"
    style={{
      position: "absolute",
      bottom: "-70px",
      right: "80px",
      zIndex: 2,
      cursor: "pointer",
    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <FaArrowLeftLong className="text-white text-2xl" />
  </motion.div>
);

const mentors = [
  {
    name: "Jhon Dwirian",
    title: "UI/UX Design",
    company: "Grab",
    image: sliderImg,
    industry: "Design & Creative",
    yearsOfExperience: 8,
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "ReactJs"],
    mentorshipTopics: ["UI/UX Design", "Product Design"],
  },
  {
    name: "Leon S Kennedy",
    title: "Machine Learning",
    company: "Google",
    image: sliderImg,
    industry: "Technology",
    yearsOfExperience: 10,
    skills: ["Python", "TensorFlow", "Deep Learning", "Data Science"],
    mentorshipTopics: ["Machine Learning",  "Data Analysis"],
  },
  {
    name: "Nguyen Thuy",
    title: "Android Development",
    company: "Airbnb",
    image: sliderImg,
    industry: "Mobile Development",
    yearsOfExperience: 6,
    skills: ["Kotlin", "Android Studio", "Java", "Firebase", "Mern Stack Developer"],
    mentorshipTopics: [ "Mobile UI", "API Integration"],
  },
  {
    name: "Sarah Johnson",
    title: "Web Development",
    company: "Microsoft",
    image: sliderImg,
    industry: "Software Development",
    yearsOfExperience: 7,
    skills: ["React", "Node.js", "CSS", "JavaScript","ExpressJS"],
    mentorshipTopics: ["Full-Stack Web", "Backend Optimization"],
  },
  {
    name: "Michael Chen",
    title: "Data Engineering",
    company: "Amazon",
    image: sliderImg,
    industry: "Data & Analytics",
    yearsOfExperience: 9,
    skills: ["SQL", "Apache Spark", "AWS", "Big Data","GCD"],
    mentorshipTopics: ["Data Pipelines", "Cloud Computing"],
  },
  {
    name: "Aisha Patel",
    title: "Product Management",
    company: "Uber",
    image: sliderImg,
    industry: "Product & Strategy",
    yearsOfExperience: 5,
    skills: ["Agile", "Roadmapping", "JIRA", "Stakeholder Management"],
    mentorshipTopics: ["Product Strategy", "Agile Methodologies"],
  },
];

const MentorMenteeSpotlight = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Background animation variants (optional, can be removed if not needed with a static white background)
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
      id="spotlight"
      className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-teal-50 overflow-hidden"
      // Removed variants and animate props since the background is now static white
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-center mb-8 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Expert <span className="relative text-[#127C71] font-extrabold">Mentors</span>
          <svg className="absolute -top-3 -right-8 w-6 md:w-8 h-auto" viewBox="0 0 3183 3072">
            <path fill="#127C71" d="M2600 224c0,0 0,0 0,0 236,198 259,562 52,809 -254,303 -1849,2089 -2221,1776 -301,-190 917,-1964 1363,-2496 207,-247 570,-287 806,-89z" />
            <path fill="#127C71" d="M3166 2190c0,0 0,0 0,0 64,210 -58,443 -270,516 -260,90 -1848,585 -1948,252 -104,-230 1262,-860 1718,-1018 212,-73 437,39 500,250z" />
            <path fill="#127C71" d="M566 3c0,0 0,0 0,0 -219,-26 -427,134 -462,356 -44,271 -255,1921 90,1962 245,62 628,-1392 704,-1869 36,-221 -114,-424 -332,-449z" />
          </svg>
        </motion.h2>

        <motion.div
          className="mb-12 custom-slider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
        >
          <Slider {...settings}>
            {mentors.map((mentor, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden max-w-sm mx-auto md:mx-0"
                whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              >
                {/* Decorative Top Gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f6f5c] to-teal-400" />

                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                  {mentor.image ? (
                    <motion.img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-teal-500 shadow-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-teal-500 flex items-center justify-center">
                      <IoPerson className="text-gray-400" size={24} />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">{mentor.name}</h4>
                    <p className="text-base font-bold text-gray-500 flex items-center">
                      <IoBriefcase className="mr-1 text-teal-600" /> {mentor.title}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="mt-6 space-y-4">
                  <p className="text-gray-700 flex items-center text-base">
                    <IoBriefcase className="mr-2 text-teal-600" />{" "}
                    <span className="font-bold text-gray-800">Industry:</span> <span className="ml-1">{mentor.industry}</span>
                  </p>
                  <p className="text-gray-700 flex items-center text-base">
                    <IoCalendar className="mr-2 text-teal-600" />{" "}
                    <span className="font-bold text-gray-800">Experience:</span> <span className="ml-1">{mentor.yearsOfExperience} years</span>
                  </p>
                  <div>
                    <p className="text-gray-700 flex items-center text-base">
                      <IoCode className="mr-2 text-teal-600" />{" "}
                      <span className="font-bold text-gray-800">Skills:</span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mentor.skills?.map((skill, index) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1 text-sm bg-teal-100 text-teal-700 rounded-full shadow-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700 flex items-center text-base">
                      <IoCode className="mr-2 text-teal-600" />{" "}
                      <span className="font-bold text-gray-800">Mentorship Topics:</span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mentor.mentorshipTopics?.map((topic, index) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1 text-sm bg-teal-200 text-teal-800 rounded-full shadow-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          {topic}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Slider>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MentorMenteeSpotlight;