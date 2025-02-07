import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Changed from useHistory to useNavigate
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const MentorUpdate = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const { authorizationToken } = useAuth();
    const [mentorData, setMentorData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        jobTitle: "",
        industry: "",
        yearsOfExperience: "",
        company: "",
        linkedInUrl: "",
        skills: "",
        mentorshipTopics: "",
        bio: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Using useNavigate instead of useHistory

    // Fetch mentor details when the component mounts
    useEffect(() => {
        const fetchMentorDetails = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/auth/mentor-user`, {
                    method: "GET",
                    headers: {
                        Authorization: authorizationToken,
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch mentor details");
                }

                const data = await response.json();
                setMentorData(data);
            } catch (err) {
                setError(err.message || "Failed to fetch mentor details");
            }
        };

        fetchMentorDetails();
    }, [authorizationToken]);

    const handleChange = (e) => {
        setMentorData({
            ...mentorData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${backendUrl}/api/auth/mentor-update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,                
                },
                body: JSON.stringify(mentorData)
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const data = await response.json();
            setLoading(false);
            toast.success(data.message || "Profile updated successfully!"); // Display success message
            navigate("/mentor-user"); // Use navigate to redirect
        } catch (err) {
            setLoading(false);
            setError(err.message || "Error updating profile");
            toast.error(error || "Error updating profile");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700">
            <motion.div
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-semibold text-center text-indigo-900 mb-6">Update Mentor Profile</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {[
                            { label: "Full Name", name: "fullName", type: "text" },
                            { label: "Phone Number", name: "phoneNumber", type: "text" },
                            { label: "Job Title", name: "jobTitle", type: "text" },
                            { label: "Industry", name: "industry", type: "text" },
                            { label: "Years of Experience", name: "yearsOfExperience", type: "number" },
                            { label: "Company", name: "company", type: "text" },
                            { label: "LinkedIn URL", name: "linkedInUrl", type: "text" },
                            { label: "Skills", name: "skills", type: "text" },
                            { label: "Mentorship Topics", name: "mentorshipTopics", type: "text" },
                        ].map(({ label, name, type }) => (
                            <div key={name} className="form-group">
                                <label htmlFor={name} className="text-lg text-indigo-700">{label}</label>
                                <input
                                    type={type}
                                    id={name}
                                    name={name}
                                    value={mentorData[name]}
                                    onChange={handleChange}
                                    className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        ))}
                        
                        <div className="form-group">
                            <label htmlFor="bio" className="text-lg text-indigo-700">Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={mentorData.bio}
                                onChange={handleChange}
                                className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="4"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {loading ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default MentorUpdate;
