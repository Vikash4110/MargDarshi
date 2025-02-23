import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import MentorConnection from "../pages/MentorConnection";
import UpdateCalendly from "../Components/UpdateCalendly";
import { Link } from "react-router-dom";
import PostedJobs from "../pages/PostedJobs";
const MentorShow = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authorizationToken } = useAuth();

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${backendUrl}/api/auth/mentor-pending-requests`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPendingRequests(data.pendingRequests || []); // Ensure it's an array
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToRequest = async (requestId, status) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/auth/mentor-respond-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({ requestId, status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      alert(data.message);

      fetchPendingRequests(); // Refresh the list after responding
    } catch (err) {
      console.error("Error responding to request:", err);
      alert("Failed to respond to request");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
        <button
          onClick={fetchPendingRequests}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <UpdateCalendly />
      <div className="p-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-6">
          Mentor Dashboard
        </h1>
        <Link
          to="/mentor-user"
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all"
        >
          Mentor User
        </Link>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <motion.div
                key={request._id}
                className="bg-white p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
                whileHover={{ scale: 1.03 }}
              >
                <h2 className="text-xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                  {request.menteeId?.fullName || "Unknown Mentee"}
                </h2>

                <div className="text-gray-600 mt-2 text-center">
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {request.menteeId?.email || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {request.menteeId?.phoneNumber || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Education:</span>{" "}
                    {request.menteeId?.currentEducationLevel || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">University:</span>{" "}
                    {request.menteeId?.universityName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Field of Study:</span>{" "}
                    {request.menteeId?.fieldOfStudy || "N/A"}
                  </p>
                </div>

                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    onClick={() => handleRespondToRequest(request._id, "accepted")}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespondToRequest(request._id, "rejected")}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No pending requests.</p>
          )}
        </motion.div>
      </div>
      <MentorConnection />
      <PostedJobs />
    </>
  );
};

export default MentorShow;