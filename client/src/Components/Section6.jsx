import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { motion } from "framer-motion"; // For animations
import { IoPerson } from "react-icons/io5"; // Icon for avatar placeholder
import Profile from '../assets/profile2.jpg'
// Custom next and previous button components
const NextArrow = ({ onClick }) => (
  <motion.div
    className="custom-next-arrow"
    style={{
      position: "absolute",
      bottom: "-60px",
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
      bottom: "-60px",
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

// Sample testimonials data (replace with your actual data)
const testimonials = [
  {
    name: "Emily Carter",
    role: "UI/UX Designer",
    company: "Grab",
    image: Profile, // Replace with actual image import if available
    feedback:
      "The mentorship I received transformed my approach to design. My mentor’s insights were invaluable!",
  },
  {
    name: "Rahul Sharma",
    role: "AI/ML Engineer",
    company: "Google",
    image: Profile,
    feedback:
      "Thanks to my mentor, I landed my dream job. The guidance was spot-on and practical.",
  },
  {
    name: "Lila Nguyen",
    role: "Android Developer",
    company: "Airbnb",
    image: Profile,
    feedback:
      "The sessions were incredibly helpful. I gained confidence in my skills and career path.",
  },
  {
    name: "James Patel",
    role: "Web Developer",
    company: "Microsoft",
    image: Profile,
    feedback:
      "My mentor’s expertise in full-stack development was a game-changer for my projects.",
  },
];

const Testimonials = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Show 3 testimonials at a time
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
          {
            breakpoint: 1024, // Tablets and smaller laptops
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 768, // Mobile screens
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };
      

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      id="testimonials"
      className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-teal-50 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-center mb-8 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="relative text-gray-800">
            What Our <span className="text-[#127C71] font-extrabold">Mentees Say</span>
            <svg
              className="absolute -top-3 -right-8 w-6 md:w-8 h-auto"
              viewBox="0 0 3183 3072"
            >
              <path
                fill="#127C71"
                d="M2600 224c0,0 0,0 0,0 236,198 259,562 52,809 -254,303 -1849,2089 -2221,1776 -301,-190 917,-1964 1363,-2496 207,-247 570,-287 806,-89z"
              />
              <path
                fill="#127C71"
                d="M3166 2190c0,0 0,0 0,0 64,210 -58,443 -270,516 -260,90 -1848,585 -1948,252 -104,-230 1262,-860 1718,-1018 212,-73 437,39 500,250z"
              />
              <path
                fill="#127C71"
                d="M566 3c0,0 0,0 0,0 -219,-26 -427,134 -462,356 -44,271 -255,1921 90,1962 245,62 628,-1392 704,-1869 36,-221 -114,-424 -332,-449z"
              />
            </svg>
          </span>
        </motion.h2>

        <motion.div
          className="mb-12 custom-slider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
        >
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
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
                  {testimonial.image ? (
                    <motion.img
                      src={testimonial.image}
                      alt={testimonial.name}
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
                    <h4 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
                      {testimonial.name}
                    </h4>
                    <p className="text-base font-medium text-gray-500">
                      {testimonial.role} @ {testimonial.company}
                    </p>
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="mt-6">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed italic">
                    "{testimonial.feedback}"
                  </p>
                </div>
              </motion.div>
            ))}
          </Slider>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Testimonials;