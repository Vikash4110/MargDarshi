import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion'; // For animations
import { useAuth } from "../store/auth";

// Animation variants for navbar items
const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95, transition: { duration: 0.2 } },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Define navbar height explicitly (e.g., 80px for desktop, adjust as needed)
  const navbarHeight = '80px';

  return (
    <>
      <motion.nav
        className="bg-white shadow-xl fixed top-0 left-0 w-full z-50"
        style={{ height: navbarHeight }} // Set a fixed height
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center py-4 h-full">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-2">
              <div className="bg-purple-500 w-5 h-5 rounded-full shadow-md"></div>
              <div className="bg-blue-500 w-3 h-3 rounded-full shadow-md"></div>
            </div>
            <Link
              to="/"
              className="ml-3 text-2xl font-bold text-[#127C71] tracking-tight hover:text-teal-600 transition-colors duration-300"
            >
              MargDarshi
            </Link>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-10 text-lg font-semibold">
            {[
              { to: '/', text: 'Home' },
              { to: '/about', text: 'About' },
              // { to: '/mentors', text: 'Mentors' }, // Uncomment if needed
              { to: '/contact', text: 'Contact' },
            ].map((link, index) => (
              <motion.div key={index} variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                <Link
                  to={link.to}
                  className="text-gray-700 hover:text-[#127C71] transition-colors duration-300"
                >
                  {link.text}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Section (Desktop) */}
          <div className="hidden md:flex space-x-4 items-center">
            {!isLoggedIn ? (
              <>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <button className="bg-gradient-to-r from-[#127C71] to-teal-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                    <Link to="/mentee-login">Join as Mentee</Link>
                  </button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <button className="bg-white border-2 border-[#127C71] text-[#127C71] font-semibold py-2 px-6 rounded-full shadow-md hover:bg-gradient-to-r hover:from-[#127C71] hover:to-teal-500 hover:text-white transition-all duration-300">
                    <Link to="/mentor-login">Become a Mentor</Link>
                  </button>
                </motion.div>
              </>
            ) : (
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link
                  to="/logout"
                  onClick={logout}
                  className="bg-red-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                >
                  Logout
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? (
                <FaTimes className="w-6 h-6 text-[#127C71]" />
              ) : (
                <FaBars className="w-6 h-6 text-[#127C71]" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg px-4 py-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="flex flex-col space-y-6 text-lg font-semibold">
              {[
                { to: '/', text: 'Home' },
                { to: '/about', text: 'About' },
                // { to: '/mentors', text: 'Mentors' }, // Uncomment if needed
                { to: '/contact', text: 'Contact' },
              ].map((link, index) => (
                <motion.div
                  key={index}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className="text-gray-700 hover:text-[#127C71] transition-colors duration-300"
                    onClick={toggleMenu}
                  >
                    {link.text}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col space-y-4 mt-6">
              {!isLoggedIn ? (
                <>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <button className="bg-gradient-to-r from-[#127C71] to-teal-500 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 w-full">
                      <Link to="/mentee-login">Join as Mentee</Link>
                    </button>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <button className="bg-white border-2 border-[#127C71] text-[#127C71] font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gradient-to-r hover:from-[#127C71] hover:to-teal-500 hover:text-white transition-all duration-300 w-full">
                      <Link to="/mentor-login">Become a Mentor</Link>
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link
                    to="/logout"
                    onClick={logout}
                    className="bg-red-500 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300 w-full text-center"
                  >
                    Logout
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>
      {/* Spacer div to prevent content overlap */}
      <div style={{ height: navbarHeight }} />
    </>
  );
};

export default Navbar;