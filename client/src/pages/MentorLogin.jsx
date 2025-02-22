import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";
import { motion } from "framer-motion";
import Img from "../assets/menteeimg.svg";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MentorLogin = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!backendUrl) {
      toast.error("Backend URL is not defined. Please check your environment variables.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const responseData = await response.json();

      if (response.ok) {
        storeTokenInLS(responseData.token);
        toast.success("Login Successful");
        navigate("/mentor-show");
      } else {
        toast.error(responseData.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  // Form animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 flex flex-col lg:flex-row items-center justify-center px-4 lg:px-10 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      {/* Left Section - Image */}
      <motion.div
        className="hidden lg:flex w-1/2 justify-center"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img src={Img} alt="Mentor Login" className="w-3/4 h-auto object-contain" />
      </motion.div>

      {/* Right Section - Form */}
      <motion.div
        className="w-full lg:w-1/2 flex justify-center"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md mx-auto text-center bg-white rounded-3xl py-10 lg:py-12 px-6 lg:px-10 shadow-2xl border border-gray-100"
        >
          {/* Toggler Buttons */}
          <div className="flex justify-between mb-8 border-b-2 border-gray-200 pb-3">
            <Link
              to="/mentee-login"
              className="w-1/2 text-center py-2 text-gray-500 font-semibold hover:text-gray-700 transition-all border-b-4 border-transparent hover:border-gray-300"
            >
              Mentee Login
            </Link>
            <Link
              to="/mentor-login"
              className="w-1/2 text-center py-2 text-[#0f6f5c] font-semibold border-b-4 border-[#0f6f5c] transition-all"
            >
              Mentor Login
            </Link>
          </div>

          {/* Heading */}
          <motion.h2
            className="text-4xl font-extrabold text-[#0f6f5c] mb-8 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Welcome, Mentor!
          </motion.h2>

          {/* Email Input */}
          <motion.div
            className="relative h-12 w-full mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder=""
              className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-[#0f6f5c] shadow-md"
              required
            />
            <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#0f6f5c]">
              <FontAwesomeIcon icon={faEnvelope} /> <span>Email</span>
            </label>
          </motion.div>

          {/* Password Input */}
          <motion.div
            className="relative h-12 w-full mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder=""
              className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-[#0f6f5c] shadow-md"
              required
            />
            <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#0f6f5c]">
              <FontAwesomeIcon icon={faLock} /> <span>Password</span>
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className={`py-3 px-6 rounded-full font-semibold text-white w-2/3 mx-auto block bg-gradient-to-r from-[#0f6f5c] to-teal-500 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="24" visible={true} />
              </div>
            ) : (
              "Login"
            )}
          </motion.button>

          {/* Additional Links */}
          <motion.div
            className="flex flex-col items-center mt-6 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-sm text-gray-600">
              New Here?{" "}
              <Link to="/mentor-register" className="text-[#0f6f5c] font-semibold hover:underline transition-all">
                Sign Up
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Forgot Password?{" "}
              <Link to="/forgot-password" className="text-[#0f6f5c] font-semibold hover:underline transition-all">
                Reset Here
              </Link>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MentorLogin;