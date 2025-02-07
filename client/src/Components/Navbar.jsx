import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from "../store/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-500 w-5 h-5 rounded-full"></div>
            <div className="bg-blue-500 w-3 h-3 rounded-full"></div>
          </div>
          <Link to="/" className="ml-2 text-xl font-semibold text-[#127c71]">MargDarshi</Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <Link to="/" className="hover:text-[#127C71] transition">Home</Link>
          <Link to="/about" className="hover:text-[#127C71] transition">About</Link>
          <Link to="/mentors" className="hover:text-[#127C71] transition">Mentors</Link>
          <Link to="/contact" className="hover:text-[#127C71] transition flex items-center">Contact</Link>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex space-x-4">
          {!isLoggedIn ? (
            // Show Join as Mentee and Become a Mentor when user is NOT logged in
            <>
              <button className="bg-[#127C71] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#0f6f5c] transition">
                <Link to="/mentee-login">Join as Mentee</Link>
              </button>
              <button className="border-2 border-[#127C71] text-[#127C71] font-semibold py-2 px-4 rounded-full hover:bg-[#127C71] hover:text-white transition">
                <Link to="/mentor-login">Become a Mentor</Link>
              </button>
            </>
          ) : (
            // Show Logout button when user is logged in
            <Link
              to="/logout" onClick={logout}
              className="rounded-full px-4 py-2 bg-red-500 text-white font-medium transition-transform duration-200 ease-in-out hover:scale-105"
            >
              Logout
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu}>
            {isOpen ? <FaTimes className="w-5 h-5 text-[#127C71]" /> : <FaBars className="w-5 h-5 text-[#127C71]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-4 px-4 py-4 bg-white shadow-lg">
          <Link to="/" className="hover:text-[#127C71] transition" onClick={toggleMenu}>Home</Link>
          <Link to="/about" className="hover:text-[#127C71] transition" onClick={toggleMenu}>About</Link>
          <Link to="/mentors" className="hover:text-[#127C71] transition" onClick={toggleMenu}>Mentors</Link>
          <Link to="/contact" className="hover:text-[#127C71] transition flex items-center" onClick={toggleMenu}>Contact</Link>

          <div className="flex flex-col space-y-4 mt-4">
            {!isLoggedIn ? (
              <>
                <button className="bg-[#127C71] text-white font-semibold py-2 px-4 rounded-full w-full hover:bg-[#0f6f5c] transition">
                  <Link to="/mentee-login">Join as Mentee</Link>
                </button>
                <button className="border-2 border-[#127C71] text-[#127C71] font-semibold py-2 px-4 rounded-full w-full hover:bg-[#127C71] hover:text-white transition">
                  <Link to="/mentor-login">Become a Mentor</Link>
                </button>
              </>
            ) : (
              <Link
                to="/logout" onClick={logout}
                className="rounded-full px-4 py-2 bg-red-500 text-white font-medium transition-transform duration-200 ease-in-out hover:scale-105"
              >
                Logout
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
