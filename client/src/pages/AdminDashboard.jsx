// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUsers, FaUserTie, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MentorList from "../Components/MentorList";
import MenteeList from "../Components/MenteeList";

const AdminDashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("mentors"); // Default to mentors
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const authorizationToken = `Bearer ${token}`;

  useEffect(() => {
    if (!token) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mentorsRes, menteesRes] = await Promise.all([
        fetch(`${backendUrl}/api/admin/mentors`, { headers: { Authorization: authorizationToken } }),
        fetch(`${backendUrl}/api/admin/mentees`, { headers: { Authorization: authorizationToken } }),
      ]);

      if (mentorsRes.status === 401 || menteesRes.status === 401 || mentorsRes.status === 403 || menteesRes.status === 403) {
        throw new Error("Admin access required or invalid token");
      }

      if (!mentorsRes.ok || !menteesRes.ok) throw new Error("Failed to fetch data");

      const mentorsData = await mentorsRes.json();
      const menteesData = await menteesRes.json();

      setMentors(mentorsData.mentors);
      setMentees(menteesData.mentees);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error(err.message || "Error fetching data");
      localStorage.removeItem("token");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type, user) => {
    setEditMode({ type, id: user._id });
    setEditData({ fullName: user.fullName, phoneNumber: user.phoneNumber, email: user.email });
  };

  const handleSave = async () => {
    try {
      const url = `${backendUrl}/api/admin/${editMode.type}/${editMode.id}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: authorizationToken },
        body: JSON.stringify(editData),
      });

      if (!response.ok) throw new Error("Failed to update");
      const updatedData = await response.json();

      if (editMode.type === "mentor") {
        setMentors((prev) => prev.map((m) => (m._id === editMode.id ? updatedData.mentor : m)));
      } else {
        setMentees((prev) => prev.map((m) => (m._id === editMode.id ? updatedData.mentee : m)));
      }

      toast.success("User updated successfully");
      setEditMode(null);
      setEditData({});
    } catch (err) {
      console.error("Error updating:", err);
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const url = `${backendUrl}/api/admin/${type}/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: authorizationToken },
      });

      if (!response.ok) throw new Error("Failed to delete");
      if (type === "mentor") {
        setMentors((prev) => prev.filter((m) => m._id !== id));
      } else {
        setMentees((prev) => prev.filter((m) => m._id !== id));
      }
      toast.success(`${type} deleted successfully`);
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error(`Failed to delete ${type}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const getProfilePictureUrl = (profilePictureId) =>
    profilePictureId ? `${backendUrl}/api/auth/images/${profilePictureId}` : null;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-gradient-to-b from-teal-800 to-teal-900 text-white p-6 flex-shrink-0 shadow-lg"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-10 flex items-center">
          <FaUserTie className="mr-2" /> Admin Panel
        </h2>
        <ul className="space-y-6">
          <li>
            <button
              onClick={() => setActiveTab("mentors")}
              className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                activeTab === "mentors" ? "bg-teal-700 text-white" : "hover:bg-teal-700 hover:text-white"
              }`}
            >
              <FaUsers className="mr-3" /> Mentors
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("mentees")}
              className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                activeTab === "mentees" ? "bg-teal-700 text-white" : "hover:bg-teal-700 hover:text-white"
              }`}
            >
              <FaUsers className="mr-3" /> Mentees
            </button>
          </li>
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
      <motion.div
        className="flex-1 p-8 overflow-auto bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h1>
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Dynamic Content */}
        <section>
          {activeTab === "mentors" && (
            <MentorList
              mentors={mentors}
              searchQuery={searchQuery}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              editMode={editMode}
              editData={editData}
              setEditData={setEditData}
              handleSave={handleSave}
              getProfilePictureUrl={getProfilePictureUrl}
            />
          )}
          {activeTab === "mentees" && (
            <MenteeList
              mentees={mentees}
              searchQuery={searchQuery}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              editMode={editMode}
              editData={editData}
              setEditData={setEditData}
              handleSave={handleSave}
              getProfilePictureUrl={getProfilePictureUrl}
            />
          )}
        </section>
      </motion.div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-600" />
  </div>
);

export default AdminDashboard;
