import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import {Link} from 'react-router-dom'
const MentorUser = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { authorizationToken } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(`${backendUrl}/api/auth/mentor-user`, {
          method: "GET",
          headers: {
            Authorization: authorizationToken,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch mentor details");

        const data = await response.json();
        setMentor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, []);

  if (loading) return <p className="text-center text-lg text-gray-700">Loading...</p>;
  if (error) return <p className="text-red-500 text-center text-lg">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-10"
    >
      <h1 className="text-3xl font-bold text-gray-800 text-center">Mentor Profile</h1>

      <div className="flex flex-col items-center mt-6">
        <img
          src={mentor.profilePicture || "https://via.placeholder.com/150"}
          alt="Mentor"
          className="w-32 h-32 rounded-full shadow-md object-cover border-4 border-blue-400"
        />

        <h2 className="text-xl font-semibold mt-3 text-gray-900">{mentor.fullName || "N/A"}</h2>
        <p className="text-gray-600">{mentor.jobTitle ? `${mentor.jobTitle} at ${mentor.company}` : "Job title not available"}</p>
        <p className="text-gray-500">{mentor.industry ? `${mentor.industry} • ${mentor.yearsOfExperience || 0} years of experience` : "Industry info unavailable"}</p>
      </div>

      <div className="mt-6 px-4">
        <p className="text-lg text-gray-700"><strong>Email:</strong> {mentor.email || "N/A"}</p>
        <p className="text-lg text-gray-700"><strong>Phone:</strong> {mentor.phoneNumber || "N/A"}</p>
        
        <h2 className="text-xl font-semibold mt-5 text-gray-800">Skills</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {mentor.skills?.length ? (
            mentor.skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{skill}</span>
            ))
          ) : (
            <span className="text-gray-500">No skills listed</span>
          )}
        </div>

        <h2 className="text-xl font-semibold mt-5 text-gray-800">Mentorship Topics</h2>
        <ul className="list-disc list-inside text-gray-700">
          {mentor.mentorshipTopics?.length ? (
            mentor.mentorshipTopics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))
          ) : (
            <li className="text-gray-500">No mentorship topics available</li>
          )}
        </ul>

        <h2 className="text-xl font-semibold mt-5 text-gray-800">Availability</h2>
        <ul className="list-disc list-inside text-gray-700">
          {mentor.availability?.length ? (
            mentor.availability.map((slot, index) => (
              <li key={index} className="mt-1">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{slot.day} - {slot.time}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No availability listed</li>
          )}
        </ul>

        <h2 className="text-xl font-semibold mt-5 text-gray-800">Social Media</h2>
        <div className="flex gap-4 mt-3">
          {mentor.linkedInUrl ? (
            <a href={mentor.linkedInUrl} target="_blank" className="text-blue-600 text-2xl hover:text-blue-800 transition duration-200">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          ) : (
            <span className="text-gray-500">LinkedIn not available</span>
          )}
          
          {mentor.socialMedia?.twitter ? (
            <a href={mentor.socialMedia.twitter} target="_blank" className="text-blue-400 text-2xl hover:text-blue-600 transition duration-200">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          ) : (
            <span className="text-gray-500">Twitter not available</span>
          )}

          {mentor.socialMedia?.github ? (
            <a href={mentor.socialMedia.github} target="_blank" className="text-gray-900 text-2xl hover:text-gray-700 transition duration-200">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          ) : (
            <span className="text-gray-500">GitHub not available</span>
          )}
        </div>
      </div>

      {/* Edit Button */}
      <div className="mt-6 text-center">
        <button
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700 focus:outline-none transition duration-300"
        >
          <Link to="/mentor-update">Edit Mentor Details</Link>
        </button>
      </div>
    </motion.div>
  );
};

export default MentorUser;
