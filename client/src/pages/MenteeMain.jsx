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
import { useAuth } from "../store/auth";

const MenteeMain = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  // Redirect to login if no token exists
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast.error("Please login to access the dashboard", { position: "top-center" });
      navigate("/mentee-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully", { position: "top-center" });
    navigate("/mentee-login");
  };

  // Define tabs with metadata for scalability
  const tabConfig = [
    { id: "profile", label: "Profile", icon: <FaUser />, component: <MenteeA /> },
    { id: "acceptedRequests", label: "Accepted Requests", icon: <FaCheckCircle />, component: <MenteeAcceptedReq /> },
    { id: "mentors", label: "Mentors", icon: <FaUsers />, component: <MenteeD /> },
    { id: "jobs", label: "Jobs", icon: <FaBriefcase />, component: <JobMenteeDashboard /> },
    { id: "blogs", label: "Blogs", icon: <FaBlog />, component: <MenteeBlogs /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex font-sans">
      {/* Sidebar */}
      <motion.aside
        className="w-72 bg-teal-900 text-white p-6 flex-shrink-0 shadow-2xl"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <div className="flex items-center mb-12">
          <FaUser className="text-3xl mr-3" />
          <h2 className="text-2xl font-bold tracking-tight">Mentee Dashboard</h2>
        </div>
        <nav className="space-y-3">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center p-4 rounded-xl text-left transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-teal-700 text-white shadow-md"
                  : "text-teal-200 hover:bg-teal-800 hover:text-white"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="ml-4 font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto w-full flex items-center p-4 rounded-xl text-left text-teal-200 hover:bg-teal-800 hover:text-white transition-all duration-300"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="ml-4 font-medium">Logout</span>
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          className="bg-white shadow-lg p-6 flex justify-between items-center border-b border-gray-200"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
            Welcome, {user?.fullName || "Mentee"}
          </h1>
          <div className="flex items-center gap-6">
            <span className="text-gray-600 font-medium hidden md:block">{user?.email || "mentee@example.com"}</span>
            <motion.img
              src={user?.profilePicture || "/default-profile.jpg"}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.header>

        {/* Content Area */}
        <motion.main
          className="flex-1 p-8 overflow-y-auto bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="bg-white rounded-xl shadow-xl p-8 border border-gray-100"
            >
              {tabConfig.find((tab) => tab.id === activeTab)?.component}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
};

export default MenteeMain;