import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaPaperPlane, FaSpinner, FaBlog, FaBriefcase,FaLink } from "react-icons/fa";
import MentorConnection from "../pages/MentorConnection";
import UpdateCalendly from "../Components/UpdateCalendly";
import PostedJobs from "../pages/PostedJobs";
import MentorBlogList from "../Components/MentorBlogList";

const MentorShow = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // For dynamic tab switching
  const { authorizationToken } = useAuth();

  useEffect(() => {
    fetchPendingRequests();
  }, [authorizationToken]);

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
      fetchPendingRequests(); // Refresh after response
    } catch (err) {
      console.error("Error responding to request:", err);
      toast.error("Failed to respond to request");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <motion.div
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaSpinner className="animate-spin text-teal-500 text-4xl" />
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          className="text-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-red-500 text-lg font-semibold">{error}</p>
          <motion.button
            onClick={fetchPendingRequests}
            className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retry
          </motion.button>
        </motion.div>
      );
    }

    switch (activeTab) {
      case "pending":
        return (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <motion.div
                  key={request._id}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <h2 className="text-xl font-semibold text-[#127C71] text-center">{request.menteeId?.fullName || "Unknown Mentee"}</h2>
                  <div className="text-gray-600 mt-4 space-y-2">
                    <p><span className="font-semibold">Email:</span> {request.menteeId?.email || "N/A"}</p>
                    <p><span className="font-semibold">Phone:</span> {request.menteeId?.phoneNumber || "N/A"}</p>
                    <p><span className="font-semibold">Education:</span> {request.menteeId?.currentEducationLevel || "N/A"}</p>
                    <p><span className="font-semibold">University:</span> {request.menteeId?.universityName || "N/A"}</p>
                    <p><span className="font-semibold">Field:</span> {request.menteeId?.fieldOfStudy || "N/A"}</p>
                  </div>
                  <div className="mt-6 flex justify-center space-x-4">
                    <motion.button
                      onClick={() => handleRespondToRequest(request._id, "accepted")}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Accept
                    </motion.button>
                    <motion.button
                      onClick={() => handleRespondToRequest(request._id, "rejected")}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reject
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">No pending requests.</p>
            )}
          </motion.div>
        );
      case "mentees":
        return <MentorConnection />;
      case "blogs":
        return <MentorBlogList />;
      case "jobs":
        return <PostedJobs />;
      case "calendly":
        return <UpdateCalendly />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 p-6">
      <motion.h1
        className="text-4xl font-extrabold text-center text-[#127C71] mb-8 tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Mentor Dashboard
      </motion.h1>

      {/* Navigation Tabs */}
      <motion.div
        className="flex justify-center space-x-4 mb-8 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {[
          { name: "Pending Requests", key: "pending", icon: <FaUser /> },
          { name: "Connected Mentees", key: "mentees", icon: <FaPaperPlane /> },
          { name: "My Blogs", key: "blogs", icon: <FaBlog /> },
          { name: "Posted Jobs", key: "jobs", icon: <FaBriefcase /> },
          { name: "Calendly", key: "calendly", icon: <FaLink /> },
        ].map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition duration-300 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Profile Link */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Link
          to="/mentor-user"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all flex items-center space-x-2"
        >
          <FaUser />
          <span>View Profile</span>
        </Link>
      </motion.div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto">{renderContent()}</div>
    </div>
  );
};

export default MentorShow;