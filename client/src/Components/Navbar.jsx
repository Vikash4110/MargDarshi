import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaTachometerAlt, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

// Animation variants
const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95, transition: { duration: 0.2 } },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, height: 0 },
  visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedIn, logoutUser, user, role, isLoading } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/");
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  const navbarHeight = '80px'; // Fixed height for consistency

  // Use role directly from context
  console.log("Navbar role:", role);
  const dashboardLink = role === 'mentor' ? '/mentor-show' : role === 'mentee' ? '/mentee-main' : '/';
  const profileLink = role === 'mentor' ? '/mentor-user' : role === 'mentee' ? '/mentee-user' : '/';

  // Debug user and role state in Navbar
  useEffect(() => {
    console.log("Navbar user:", user);
    console.log("Navbar role:", role);
  }, [user, role]);

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg fixed top-0 left-0 w-full z-50" style={{ height: navbarHeight }}>
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center py-4 h-full">
          <div className="text-[#127C71] font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.nav
        className="bg-white shadow-lg fixed top-0 left-0 w-full z-50 border-b border-teal-100"
        style={{ height: navbarHeight }}
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
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-5 h-5 rounded-full shadow-md"></div>
              <div className="bg-blue-500 w-3 h-3 rounded-full shadow-md"></div>
            </div>
            <Link
              to="/"
              className="ml-3 text-2xl font-bold text-[#127C71] tracking-tight hover:text-teal-600 transition-colors duration-300"
            >
              MentorConnect
            </Link>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-10 text-lg font-medium">
            {[
              { to: '/', text: 'Home' },
              { to: '/about', text: 'About' },
              {/* { to: '/contact', text: 'Contact' }, */}
            ].map((link, index) => (
              <motion.div
                key={index}
                variants={navItemVariants}
                whileHover={{ scale: 1.1, color: '#127C71' }}
                transition={{ duration: 0.3 }}
              >
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
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <div className="relative">
                <motion.button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-[#127C71] font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser className="text-lg" />
                  <span>{user?.fullName || 'User'}</span>
                </motion.button>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg border border-teal-100"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Link
                      to={profileLink}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-[#127C71] transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUserCircle className="mr-2" /> Profile
                    </Link>
                    <Link
                      to={dashboardLink}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-[#127C71] transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaTachometerAlt className="mr-2" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link
                    to="/mentee-login"
                    className="bg-gradient-to-r from-[#127C71] to-teal-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Join as Mentee
                  </Link>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link
                    to="/mentor-login"
                    className="bg-white border-2 border-[#127C71] text-[#127C71] font-semibold py-2 px-6 rounded-full shadow-md hover:bg-gradient-to-r hover:from-[#127C71] hover:to-teal-500 hover:text-white transition-all duration-300"
                  >
                    Become a Mentor
                  </Link>
                </motion.div>
              </>
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
            className="md:hidden bg-white shadow-xl px-6 py-6 border-t border-teal-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="flex flex-col space-y-6 text-lg font-medium">
              {[
                { to: '/', text: 'Home' },
                { to: '/about', text: 'About' },
                {/* { to: '/contact', text: 'Contact' }, */}
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
              {isLoggedIn ? (
                <>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to={profileLink}
                      className="bg-[#127C71] text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-teal-600 transition-all duration-300 w-full text-center"
                      onClick={toggleMenu}
                    >
                      Profile
                    </Link>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to={dashboardLink}
                      className="bg-gradient-to-r from-[#127C71] to-teal-500 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 w-full text-center"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300 w-full text-center"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to="/mentee-login"
                      className="bg-gradient-to-r from-[#127C71] to-teal-500 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 w-full text-center"
                      onClick={toggleMenu}
                    >
                      Join as Mentee
                    </Link>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to="/mentor-login"
                      className="bg-white border-2 border-[#127C71] text-[#127C71] font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gradient-to-r hover:from-[#127C71] hover:to-teal-500 hover:text-white transition-all duration-300 w-full text-center"
                      onClick={toggleMenu}
                    >
                      Become a Mentor
                    </Link>
                  </motion.div>
                </>
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
