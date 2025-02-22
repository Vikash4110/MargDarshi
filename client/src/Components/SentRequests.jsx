import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { IoArrowBack, IoBriefcase, IoCalendar, IoPerson } from "react-icons/io5";

const SentRequests = ({ onBack }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSentRequests();
  }, []);

  const fetchSentRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-sent-requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSentRequests(data.sentRequests || []);
    } catch (err) {
      console.error("Error fetching sent requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawRequest = async (requestId) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-withdraw-request`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ requestId }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      toast.success("Request withdrawn successfully!");
      setSentRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error("Error withdrawing request:", err);
      toast.error("Failed to withdraw request. Try again!");
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

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 p-8 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="flex items-center p-4 bg-gradient-to-r from-[#0f6f5c] to-teal-600 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 mb-10 shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <IoArrowBack className="mr-2" /> Back to Mentor Search
      </motion.button>

      {/* Sent Requests List */}
      {loading ? (
        <motion.p
          className="text-center text-gray-600 text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading sent requests...
        </motion.p>
      ) : error ? (
        <motion.p
          className="text-center text-red-500 text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.p>
      ) : sentRequests.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence>
            {sentRequests.map(({ _id, mentorId }) => (
              <motion.div
                key={_id}
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
                  {mentorId.profilePicture ? (
                    <motion.img
                      src={`${backendUrl}/api/auth/images/${mentorId.profilePicture}`}
                      alt={mentorId.fullName}
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
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">{mentorId.fullName}</h2>
                    <p className="text-bold text-gray-500 flex items-center">
                      <IoBriefcase className="mr-1 text-teal-600" /> {mentorId.jobTitle}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="mt-6 space-y-4">
                  <p className="text-gray-700 flex items-center text-bold">
                    <IoBriefcase className="mr-2 text-teal-600" />{" "}
                    <span className="font-bold text-gray-800">Industry:</span> <span className="ml-1">{mentorId.industry}</span>
                  </p>
                  <p className="text-gray-700 flex items-center text-bold">
                    <IoCalendar className="mr-2 text-teal-600" />{" "}
                    <span className="font-bold text-gray-800">Experience:</span> <span className="ml-1">{mentorId.yearsOfExperience} years</span>
                  </p>
                </div>

                {/* Withdraw Button */}
                <motion.button
                  onClick={() => handleWithdrawRequest(_id)}
                  className="mt-6 w-full py-3 rounded-lg font-semibold text-white shadow-md bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Withdraw Request
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.p
          className="text-center text-gray-600 text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No sent requests found.
        </motion.p>
      )}
    </motion.div>
  );
};

export default SentRequests;