

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, FaCheckCircle, FaUsers, FaBriefcase, 
  FaBlog, FaSignOutAlt, FaBell, FaSearch, 
  FaChartLine, FaCalendarAlt, FaCog, FaQuestionCircle,
  FaHome, FaEnvelope, FaHandshake, FaUserTie
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import MenteeAcceptedReq from '../pages/MenteeAcceptedReq';
import JobMenteeDashboard from '../pages/JobMenteeDashboard';
import MenteeBlogs from "../pages/MenteeBlogs";
import Mentors from '../pages/Mentors';
import MenteeUser from '../pages/MenteeUser';
import SkillAssessment from '../Components/MenteeD'; // Add this import
import { useAuth } from "../store/auth";
import Insights from '../Components/MentorInsights'
// Reusable Components
const NavItem = ({ icon, label, active, onClick }) => (
  <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-200 font-medium ${
        active 
          ? "bg-teal-50 text-teal-600 font-semibold" 
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      <span className={`w-5 h-5 flex items-center justify-center ${active ? "text-teal-500" : "text-gray-500"}`}>
        {icon}
      </span>
      {label}
    </button>
  </motion.div>
);

const StatCard = ({ icon, value, label, change, onClick }) => (
  <motion.div 
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer"
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-gray-600">{label}</p>
      </div>
      <div className="p-3 rounded-lg bg-opacity-20 bg-gray-200">
        {icon}
      </div>
    </div>
    <p className={`text-xs mt-2 ${change.startsWith('+') ? 'text-green-500' : 'text-blue-500'}`}>
      {change}
    </p>
  </motion.div>
);

const ActionCard = ({ icon, title, description, onClick, color }) => {
  const colorClasses = {
    blue: 'border-blue-100 hover:border-blue-300 bg-blue-50 text-blue-500',
    purple: 'border-purple-100 hover:border-purple-300 bg-purple-50 text-purple-500',
    teal: 'border-teal-100 hover:border-teal-300 bg-teal-50 text-teal-500'
  };

  return (
    <motion.div
      className={`bg-white border rounded-lg p-5 cursor-pointer transition-colors ${colorClasses[color]}`}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className={`w-10 h-10 rounded-full bg-opacity-20 flex items-center justify-center mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
};

const ActivityItem = ({ icon, title, description, time }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
  </div>
);

// Dashboard Home Component
const DashboardHome = ({ user, setActiveTab }) => {
  const stats = [
    { icon: <FaUserTie className="text-blue-500" />, value: "3", label: "Active Mentors", change: "+1 this week", onClick: () => setActiveTab("acceptedRequests") },
    { icon: <FaCalendarAlt className="text-green-500" />, value: "2", label: "Upcoming Meetings", change: "Tomorrow", onClick: () => setActiveTab("acceptedRequests") },
    { icon: <FaBriefcase className="text-purple-500" />, value: "5", label: "Job Applications", change: "2 new", onClick: () => setActiveTab("jobs") },
    { icon: <FaChartLine className="text-orange-500" />, value: "78%", label: "Learning Progress", change: "+5% this week", onClick: () => setActiveTab("blogs") },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <motion.div
        className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-lg p-6 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName || "Mentee"}!</h2>
            <p className="opacity-90 max-w-lg">
              Your mentorship journey is progressing well. Check your upcoming sessions or explore new learning resources.
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <FaChartLine className="text-xl" />
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            change={stat.change}
            onClick={stat.onClick}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            icon={<FaUserTie className="text-blue-500" />}
            title="Find Mentors"
            description="Connect with industry experts"
            onClick={() => setActiveTab("mentors")}
            color="blue"
          />
          <ActionCard
            icon={<FaBriefcase className="text-purple-500" />}
            title="Career Hub"
            description="Explore job opportunities"
            onClick={() => setActiveTab("jobs")}
            color="purple"
          />
          <ActionCard
            icon={<FaBlog className="text-teal-500" />}
            title="Learning Resources"
            description="Expand your knowledge"
            onClick={() => setActiveTab("blogs")}
            color="teal"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <ActivityItem 
            icon={<FaUserTie className="text-blue-500" />}
            title="New mentor connection"
            description="You connected with Sarah Johnson"
            time="2 hours ago"
          />
          <ActivityItem 
            icon={<FaCalendarAlt className="text-green-500" />}
            title="Upcoming meeting"
            description="Scheduled with Mark for tomorrow"
            time="1 day ago"
          />
          <ActivityItem 
            icon={<FaBriefcase className="text-purple-500" />}
            title="Job application"
            description="Applied for Frontend Developer at TechCo"
            time="2 days ago"
          />
        </div>
      </div>
    </div>
  );
};

const MenteeMain = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-teal-400 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/mentee-login");
  };

  // Define tabs with metadata for scalability
  const tabConfig = [
    { id: "home", label: "Dashboard", icon: <FaHome className="w-4 h-4" />, component: <DashboardHome user={user} setActiveTab={setActiveTab} /> },
    { id: "profile", label: "My Profile", icon: <FaUser className="w-4 h-4" />, component: <MenteeUser /> },
    { id: "acceptedRequests", label: "My Mentors", icon: <FaCheckCircle className="w-4 h-4" />, component: <MenteeAcceptedReq /> },
    { id: "mentors", label: "Find Mentors", icon: <FaUserTie className="w-4 h-4" />, component: <Mentors /> },
    { id: "skillAssessment", label: "Skill Assessment", icon: <FaChartLine className="w-4 h-4" />, component: <SkillAssessment /> },
    { id: "jobs", label: "Career Hub", icon: <FaBriefcase className="w-4 h-4" />, component: <JobMenteeDashboard /> },
    { id: "blogs", label: "Resources", icon: <FaBlog className="w-4 h-4" />, component: <MenteeBlogs /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-teal-600 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <motion.aside
        className={`w-64 bg-white shadow-lg p-6 flex flex-col justify-between fixed h-full border-r border-gray-200 z-10 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          {/* Logo/Branding */}
          <div className="mb-10 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-500 p-2 rounded-lg">
                <FaUser className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">MentorConnect</h2>
            </div>
            <p className="text-xs text-gray-500 bg-teal-50 px-2 py-1 rounded-full">
              Mentee Dashboard
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {tabConfig.map((tab) => (
              <NavItem 
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
              />
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-medium text-red-500 hover:bg-red-50"
          >
            <FaSignOutAlt className="w-4 h-4" /> Logout
          </button>
          
          {/* User Profile Mini */}
          <div className="flex items-center gap-3 mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold">
              {user?.fullName?.charAt(0) || "M"}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user?.fullName || "Mentee"}</p>
              <p className="text-xs text-gray-500">Mentee Account</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">
            {tabConfig.find(tab => tab.id === activeTab)?.label || "Dashboard"}
          </h1>
          
          <div className="flex items-center gap-4">
           
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold">
                {user?.fullName?.charAt(0) || "M"}
              </div>
              <span className="font-medium text-gray-700 hidden md:inline">{user?.fullName || "Mentee"}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab !== "home" && (
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tabConfig.find((tab) => tab.id === activeTab)?.component}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MenteeMain;;