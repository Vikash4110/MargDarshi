import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";

const MenteeDashboard = () => {
  const { authorizationToken } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [mentors, setMentors] = useState([]); // All mentors
  const [matchingMentors, setMatchingMentors] = useState([]); // Matching mentors
  const [connectedMentors, setConnectedMentors] = useState([]); // Connected mentors

  // ✅ Fetch all mentors
  const fetchAllMentors = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-all`, {
        headers: { Authorization: authorizationToken },
      });
      const data = await response.json();
      setMentors(data.mentors || []); // Ensure default empty array
    } catch (error) {
      console.error("Error fetching Mentors:", error);
      setMentors([]); // Prevent undefined state
    }
  };

  // ✅ Fetch matching mentors
  const fetchMatchingMentors = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-matching-mentors`, {
          headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      setMatchingMentors(data.matchingMentors || []);
    } catch (error) {
      console.error("Error fetching matching mentors:", error);
      setMatchingMentors([]);
    }
  };

  // ✅ Fetch connected mentors
  const fetchConnectedMentors = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-connected-mentors`, {
          headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      setConnectedMentors(data.connectedMentors || []);
    } catch (error) {
      console.error("Error fetching connected mentors:", error);
      setConnectedMentors([]);
    }
  };

  useEffect(() => {
    fetchAllMentors();
    fetchMatchingMentors();
    fetchConnectedMentors();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mt-8">Mentee Dashboard</h1>

      {/* 🔹 All Mentors Section */}
      <h2 className="text-2xl font-bold mt-8">All Mentors</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Full Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Expertise</th>
            </tr>
          </thead>
          <tbody>
            {mentors.length > 0 ? (
              mentors.map((mentor) => (
                <tr key={mentor._id} className="border-t">
                  <td className="py-2 px-4">{mentor.fullName}</td>
                  <td className="py-2 px-4">{mentor.email}</td>
                  <td className="py-2 px-4">{mentor.expertise?.join(", ") || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-2 px-4 text-center text-gray-500">
                  No mentors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Matching Mentors Section */}
      <h2 className="text-2xl font-bold mt-8">Matching Mentors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {matchingMentors.length > 0 ? (
          matchingMentors.map((mentor) => (
            <div key={mentor._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold">{mentor.fullName}</h3>
              <p className="text-gray-600">{mentor.mentorshipTopics?.join(", ") || "N/A"}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No matching mentors available.</p>
        )}
      </div>

      {/* 🔹 Connected Mentors Section */}
      <h2 className="text-2xl font-bold mt-8">Connected Mentors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {connectedMentors.length > 0 ? (
          connectedMentors.map((mentor) => (
            <div key={mentor._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold">{mentor.fullName}</h3>
              <p className="text-gray-600">{mentor.mentorshipTopics?.join(", ") || "N/A"}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No connected mentors.</p>
        )}
      </div>
    </div>
  );
};

export default MenteeDashboard;
