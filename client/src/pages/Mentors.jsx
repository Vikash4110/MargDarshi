import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { IoSearch, IoFilter, IoChevronDown, IoChevronUp, IoBriefcase, IoCode, IoCalendar, IoPerson } from "react-icons/io5";
import SentRequests from "../Components/SentRequests";
import Img from "../assets/vecteezy_3d-icon-note-search_16326951.png";

const MentorList = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showSentRequests, setShowSentRequests] = useState(false);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-all`);
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
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
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      setSentRequests((prev) => new Set([...prev, mentorId]));
      toast.success("Request Sent Successfully!");
    } catch (err) {
      console.error("Error sending request:", err);
      toast.error("Failed to send request.");
    }
  };

  const handleSearch = () => {
    let filtered = mentors;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (mentor) =>
          mentor.skills?.some((skill) => skill.toLowerCase().includes(lowerQuery)) ||
          mentor.mentorshipTopics?.some((topic) => topic.toLowerCase().includes(lowerQuery))
      );
    }
    setFilteredMentors(filtered);
  };

  const handleSort = (sortType) => {
    let sortedMentors = [...filteredMentors];
    switch (sortType) {
      case "experience_asc":
        sortedMentors.sort((a, b) => a.yearsOfExperience - b.yearsOfExperience);
        break;
      case "experience_desc":
        sortedMentors.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
        break;
      default:
        break;
    }
    setFilteredMentors(sortedMentors);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, mentors]);

  useEffect(() => {
    handleSort(sortBy);
  }, [sortBy]);

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

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 p-8 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      {/* Search and Sorting Section */}
      {!showSentRequests && (
        <motion.div
          className="flex items-center justify-center max-w-7xl mx-auto mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="bg-gradient-to-r from-[#0f6f5c] to-teal-600 p-8 rounded-2xl shadow-xl text-white w-1/2">
            <motion.h2
              className="text-3xl font-extrabold mb-6 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Discover Your Mentor
            </motion.h2>
            <div className="relative flex-1 mb-6">
              <input
                type="text"
                placeholder="Search by skills or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 text-gray-800 shadow-sm"
              />
              <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500" size={20} />
            </div>
            <div className="flex space-x-4">
              <motion.button
                onClick={() => setSortBy("experience_asc")}
                className="flex items-center p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoChevronUp className="mr-2" /> Exp: Low to High
              </motion.button>
              <motion.button
                onClick={() => setSortBy("experience_desc")}
                className="flex items-center p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoChevronDown className="mr-2" /> Exp: High to Low
              </motion.button>
            </div>
          </div>
          <motion.div
            className="flex-shrink-0 w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img src={Img} alt="Search Illustration" className="h-80 w-auto rounded-2xl " />
          </motion.div>
        </motion.div>
      )}

      {/* Toggle Sent Requests */}
      {!showSentRequests && (
        <motion.button
          onClick={() => setShowSentRequests(!showSentRequests)}
          className="flex items-center p-4 bg-gradient-to-r from-[#0f6f5c] to-teal-600 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 mb-10 shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoFilter className="mr-2" /> View Your Sent Requests
        </motion.button>
      )}

      {/* Sent Requests Component */}
      {showSentRequests && <SentRequests onBack={() => setShowSentRequests(false)} />}

      {/* Mentor Cards */}
      {!showSentRequests && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence>
            {filteredMentors.map((mentor) => (
              <motion.div
                key={mentor._id}
                className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              >
                {/* Decorative Top Gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f6f5c] to-teal-400" />

                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                  {mentor.profilePicture ? (
                    <motion.img
                      src={`${backendUrl}/api/auth/images/${mentor.profilePicture}`}
                      alt={mentor.fullName}
                      className="w-16 h-16 object-cover rounded-full border-2 border-teal-500 shadow-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-teal-500 flex items-center justify-center">
                      <IoPerson className="text-gray-400" size={24} />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">{mentor.fullName}</h2>
                    <p className="text-base font-bold text-gray-500 flex items-center">
                      <IoBriefcase className="mr-1 text-teal-600" /> {mentor.jobTitle}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="mt-6 space-y-4">
                  <p className="text-gray-700 flex items-center text-base">
                    <IoBriefcase className="mr-2 text-teal-600" />{" "}
                    <span className="font-bold text-gray-800">Industry:</span> <span className="ml-1">{mentor.industry}</span>
                  </p>
                  <p className="text-gray-700 flex items-center text-base">
                    <IoCalendar className="mr-2 text-teal-600" />{" "}
                    <span className="font-bold text-gray-800">Experience:</span> <span className="ml-1">{mentor.yearsOfExperience} years</span>
                  </p>
                  <div>
                    <p className="text-gray-700 flex items-center text-base">
                      <IoCode className="mr-2 text-teal-600" />{" "}
                      <span className="font-bold text-gray-800">Skills:</span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mentor.skills?.map((skill, index) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1 text-sm bg-teal-100 text-teal-700 rounded-full shadow-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700 flex items-center text-base">
                      <IoCode className="mr-2 text-teal-600" />{" "}
                      <span className="font-bold text-gray-800">Mentorships:</span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mentor.mentorshipTopics?.map((topic, index) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1 text-sm bg-teal-200 text-teal-800 rounded-full shadow-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          {topic}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  onClick={() => !sentRequests.has(mentor._id) && handleSendRequest(mentor._id)}
                  className={`mt-6 w-full py-3 rounded-lg font-semibold text-white shadow-md transition duration-300 ${
                    sentRequests.has(mentor._id)
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#0f6f5c] to-teal-500 hover:from-teal-600 hover:to-teal-700"
                  }`}
                  whileHover={{ scale: sentRequests.has(mentor._id) ? 1 : 1.05 }}
                  whileTap={{ scale: sentRequests.has(mentor._id) ? 1 : 0.95 }}
                  disabled={sentRequests.has(mentor._id)}
                >
                  {sentRequests.has(mentor._id) ? "Request Sent" : "Connect with Mentor"}
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MentorList;