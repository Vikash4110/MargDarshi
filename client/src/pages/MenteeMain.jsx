import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaCheckCircle, FaUsers, FaBriefcase, FaBlog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MenteeA from "../Components/MenteeA"; 
import MenteeAcceptedReq from "../pages/MenteeAcceptedReq";
import MenteeD from '../Components/MenteeD';
import JobMenteeDashboard from '../pages/JobMenteeDashboard';
import MenteeBlogs from "../pages/MenteeBlogs";
import { useAuth } from "../store/auth"; // Assuming you have an auth context

const MenteeMain = () => {
  const [activeTab, setActiveTab] = useState("profile"); // Default tab
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth(); // Assuming useAuth provides user data and logout

  // Check if user is logged in
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast.error("Please login to access the dashboard");
      navigate("/mentee-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/mentee-login");
  };

  // Tab components mapping
  const tabs = {
    profile: <MenteeA />,
    acceptedRequests: <MenteeAcceptedReq />,
    mentors: <MenteeD />,
    jobs: <JobMenteeDashboard />,
    blogs: <MenteeBlogs />,
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-teal-800 text-white p-6 flex-shrink-0 shadow-lg"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-10 flex items-center">
          <FaUser className="mr-2" /> Mentee Dashboard
        </h2>
        <ul className="space-y-4">
          {[
            { id: "profile", label: "Profile", icon: <FaUser /> },
            { id: "acceptedRequests", label: "Accepted Requests", icon: <FaCheckCircle /> },
            { id: "mentors", label: "Mentors", icon: <FaUsers /> },
            { id: "jobs", label: "Jobs", icon: <FaBriefcase /> },
            { id: "blogs", label: "Blogs", icon: <FaBlog /> },
          ].map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id ? "bg-teal-600 text-white" : "hover:bg-teal-700 hover:text-white"
                }`}
              >
                {tab.icon}
                <span className="ml-3">{tab.label}</span>
              </button>
            </li>
          ))}
          <li className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 rounded-lg text-left hover:bg-teal-700 transition-colors"
            >
              <FaSignOutAlt className="mr-3" /> Logout
            </button>
          </li>
        </ul>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header
          className="bg-white shadow-md p-6 flex justify-between items-center"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome, {user?.fullName || "Mentee"}
          </h1>
          <div className="flex items-center gap-4">
            <img
              src={user?.profilePicture || "/default-profile.jpg"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-gray-600">{user?.email || "mentee@example.com"}</span>
          </div>
        </motion.header>

        {/* Content Area */}
        <motion.main
          className="flex-1 p-8 bg-gray-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              {tabs[activeTab]}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
};

export default MenteeMain;