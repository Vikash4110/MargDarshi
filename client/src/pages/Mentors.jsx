import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Img from "../assets/profile2.jpg";
import { Link } from "react-router-dom";

const MentorList = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    setError(null);

    if (!backendUrl) {
      setError("Backend URL is not defined. Check your .env file.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-all`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const mentorList = Array.isArray(data) ? data : data.mentors || [];
      setMentors(mentorList);
      setFilteredMentors(mentorList);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (mentorId) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-send-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ mentorId }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      alert(data.message);
    } catch (err) {
      console.error("Error sending request:", err);
      alert("Failed to send request");
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredMentors(mentors);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = mentors.filter(
      (mentor) =>
        mentor.skills?.some((skill) => skill.toLowerCase().includes(lowerQuery)) ||
        mentor.mentorshipTopics?.some((topic) => topic.toLowerCase().includes(lowerQuery))
    );

    setFilteredMentors(filtered);
  }, [searchQuery, mentors]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md p-6 hidden lg:block border-r border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Mentor</h2>
        <input
          type="text"
          placeholder="Search skills or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Meet Our Mentors</h1>
          <Link
            to="/mentee-accepted-req"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
          >
            Connected Mentors
          </Link>
        </div>

        {/* Mentor Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => (
              <motion.div
                key={mentor._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-300 hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={Img}
                    alt={mentor.fullName}
                    className="w-24 h-24 object-cover rounded-full border-4 border-blue-500 shadow-md"
                  />
                  <h2 className="mt-4 text-xl font-bold text-gray-800">{mentor.fullName}</h2>
                  <p className="text-gray-600 text-sm">{mentor.jobTitle}</p>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-gray-700 font-semibold">Industry: {mentor.industry}</p>
                  <p className="text-gray-700 font-semibold">Experience: {mentor.yearsOfExperience} years</p>
                </div>

                <div className="mt-4">
                  <p className="font-semibold text-gray-700">Skills:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mentor.skills?.map((skill, index) => (
                      <span key={index} className="px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSendRequest(mentor._id)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Send Request
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No mentors match your search.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MentorList;
