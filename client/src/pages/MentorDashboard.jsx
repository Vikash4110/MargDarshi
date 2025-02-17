// pages/MentorDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";

const MentorDashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { authorizationToken } = useAuth();
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [connectedMentees, setConnectedMentees] = useState([]);

  // Fetch connection requests
  const fetchConnectionRequests = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-connection-requests`, {
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      setConnectionRequests(data.requests);
    } catch (error) {
      console.error("Error fetching connection requests:", error);
    }
  };

  // Fetch connected mentees
  const fetchConnectedMentees = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-connected-mentees`, {
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      setConnectedMentees(data.connectedMentees);
    } catch (error) {
      console.error("Error fetching connected mentees:", error);
    }
  };

  // Respond to connection request
  const respondToRequest = async (requestId, status) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-respond-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ requestId, status }),
      });
      const data = await response.json();
      alert(data.message);
      fetchConnectionRequests(); // Refresh the list
      fetchConnectedMentees(); // Refresh connected mentees
    } catch (error) {
      console.error("Error responding to request:", error);
    }
  };

  useEffect(() => {
    fetchConnectionRequests();
    fetchConnectedMentees();
  }, []);

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mt-8">Mentor Dashboard</h1>

        {/* Connection Requests */}
        <h2 className="text-2xl font-bold mt-8">Connection Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {connectionRequests.map((request) => (
            <div key={request._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold">{request.menteeId.fullName}</h3>
              <p className="text-gray-600">{request.menteeId.careerInterests.join(", ")}</p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => respondToRequest(request._id, "accepted")}
                  className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => respondToRequest(request._id, "rejected")}
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Connected Mentees */}
        <h2 className="text-2xl font-bold mt-8">Connected Mentees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {connectedMentees.map((mentee) => (
            <div key={mentee._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold">{mentee.fullName}</h3>
              <p className="text-gray-600">{mentee.careerInterests.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;