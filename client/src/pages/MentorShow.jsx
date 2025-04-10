import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, FaPaperPlane, FaSpinner, FaBlog, 
  FaBriefcase, FaLink, FaSignOutAlt, FaBell, 
  FaSearch, FaChartLine, FaCalendarAlt, FaCog, 
  FaQuestionCircle, FaHome, FaEnvelope, FaHandshake, 
  FaUserTie, FaCheckCircle, FaUsers
} from "react-icons/fa";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import MentorConnection from "../pages/MentorConnection";
import UpdateCalendly from "../Components/UpdateCalendly";
import PostedJobs from "../pages/PostedJobs";
import MentorBlogList from "../Components/MentorBlogList";
import MentorInsights from "../Components/MentorInsights";

// Reusable Components (same as mentee dashboard)
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

// Dashboard Home Component for Mentor
const DashboardHome = ({ user, setActiveTab, pendingRequests }) => {
  const stats = [
    { icon: <FaUsers className="text-blue-500" />, value: pendingRequests.length, label: "Pending Requests", change: "+2 this week", onClick: () => setActiveTab("pending") },
    { icon: <FaUserTie className="text-green-500" />, value: "5", label: "Active Mentees", change: "1 new", onClick: () => setActiveTab("mentees") },
    { icon: <FaBriefcase className="text-purple-500" />, value: "3", label: "Posted Jobs", change: "1 active", onClick: () => setActiveTab("jobs") },
    { icon: <FaChartLine className="text-orange-500" />, value: "92%", label: "Response Rate", change: "+3% this month", onClick: () => setActiveTab("mentees") },
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
            <h2 className="text-2xl font-bold mb-2">Welcome, {user?.fullName || "Mentor"}!</h2>
            <p className="opacity-90 max-w-lg">
              You're making a difference in mentees' lives. Check your pending requests or update your availability.
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <FaUserTie className="text-xl" />
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
            icon={<FaUsers className="text-blue-500" />}
            title="Pending Requests"
            description="Review new mentorship requests"
            onClick={() => setActiveTab("pending")}
            color="blue"
          />
          <ActionCard
            icon={<FaLink className="text-purple-500" />}
            title="Update Calendly"
            description="Set your availability"
            onClick={() => setActiveTab("calendly")}
            color="purple"
          />
          <ActionCard
            icon={<FaBlog className="text-teal-500" />}
            title="Create Content"
            description="Share your knowledge"
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
            icon={<FaUser className="text-blue-500" />}
            title="New request received"
            description="From Sarah Johnson"
            time="2 hours ago"
          />
          <ActivityItem 
            icon={<FaCalendarAlt className="text-green-500" />}
            title="Upcoming session"
            description="With Mark tomorrow"
            time="1 day ago"
          />
          <ActivityItem 
            icon={<FaBriefcase className="text-purple-500" />}
            title="Job application"
            description="For your posted position"
            time="2 days ago"
          />
        </div>
      </div>
    </div>
  );
};

const MentorShow = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { authorizationToken, user, logoutUser, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "pending") {
      fetchPendingRequests();
    }
  }, [activeTab, authorizationToken]);

  const fetchPendingRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-pending-requests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      setPendingRequests(data.pendingRequests || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToRequest = async (requestId, status) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-respond-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ requestId, status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.message);
      fetchPendingRequests();
    } catch (err) {
      console.error("Error responding to request:", err);
      toast.error("Failed to respond to request");
    }
  };

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/mentor-login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome user={user} setActiveTab={setActiveTab} pendingRequests={pendingRequests} />;
      case "pending":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Pending Requests</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-teal-500 text-4xl" />
              </div>
            ) : error ? (
              <div className="text-center p-6">
                <p className="text-red-500 text-lg font-semibold">{error}</p>
                <motion.button
                  onClick={fetchPendingRequests}
                  className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Retry
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <motion.div
                      key={request._id}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h2 className="text-lg font-semibold text-teal-600 text-center mb-4">
                        {request.menteeId?.fullName || "Unknown Mentee"}
                      </h2>
                      <div className="text-gray-600 space-y-2 text-sm">
                        <p><span className="font-medium">Email:</span> {request.menteeId?.email || "N/A"}</p>
                        <p><span className="font-medium">Education:</span> {request.menteeId?.currentEducationLevel || "N/A"}</p>
                        <p><span className="font-medium">University:</span> {request.menteeId?.universityName || "N/A"}</p>
                        <p><span className="font-medium">Field:</span> {request.menteeId?.fieldOfStudy || "N/A"}</p>
                      </div>
                      <div className="mt-6 flex justify-center space-x-3">
                        <motion.button
                          onClick={() => handleRespondToRequest(request._id, "accepted")}
                          className="px-4 py-2 bg-teal-500 text-white rounded-lg shadow-sm hover:bg-teal-600 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          onClick={() => handleRespondToRequest(request._id, "rejected")}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Decline
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No pending requests at this time</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case "mentees":
        return <MentorConnection />;
      case "blogs":
        return <MentorBlogList />;
      case "jobs":
        return <PostedJobs />;
      case "calendly":
        return <UpdateCalendly />;
      case "insights":
        return <MentorInsights />;
      default:
        return null;
    }
  };

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

  // Define tabs with metadata for scalability
  const tabConfig = [
    { id: "home", label: "Dashboard", icon: <FaHome className="w-4 h-4" /> },
    { id: "pending", label: "Requests", icon: <FaUsers className="w-4 h-4" /> },
    { id: "mentees", label: "My Mentees", icon: <FaUserTie className="w-4 h-4" /> },
    { id: "blogs", label: "My Blogs", icon: <FaBlog className="w-4 h-4" /> },
    { id: "jobs", label: "Posted Jobs", icon: <FaBriefcase className="w-4 h-4" /> },
    { id: "calendly", label: "Availability", icon: <FaLink className="w-4 h-4" /> },
    { id: "insights", label: "Insights", icon: <FaChartLine className="w-4 h-4" /> },
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
                <FaUserTie className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">MentorConnect</h2>
            </div>
            <p className="text-xs text-gray-500 bg-teal-50 px-2 py-1 rounded-full">
              Mentor Dashboard
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
          <Link
            to="/mentor-user"
            className="flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <FaUser className="w-4 h-4" /> My Profile
          </Link>
          
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
              <p className="text-sm font-medium text-gray-800">{user?.fullName || "Mentor"}</p>
              <p className="text-xs text-gray-500">Mentor Account</p>
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
            {/* <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <FaBell className="text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button> */}
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold">
                {user?.fullName?.charAt(0) || "M"}
              </div>
              <span className="font-medium text-gray-700 hidden md:inline">{user?.fullName || "Mentor"}</span>
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
            {renderContent()}
          </motion.div>
        </div>
      </main>

      {/* Notifications Panel */}
      {notificationsOpen && (
        <motion.div 
          className="fixed right-6 top-16 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="p-4">
            <div className="text-center py-8 text-gray-500">
              <FaBell className="mx-auto text-2xl mb-2 opacity-30" />
              <p>No new notifications</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MentorShow;