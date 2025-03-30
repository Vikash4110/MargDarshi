import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaLinkedin, FaBriefcase, FaUserTie, FaGraduationCap, FaChartLine, FaBuilding, FaPhone, FaPenAlt } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";

const MentorUpdate = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { authorizationToken } = useAuth();
    const navigate = useNavigate();

    const [mentorData, setMentorData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        jobTitle: "",
        industry: "",
        yearsOfExperience: "",
        company: "",
        linkedInUrl: "",
        skills: "", // Ensure this is initialized as string
        mentorshipTopics: "", // Ensure this is initialized as string
        bio: ""
    });

    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState("personal");
    const [skillInput, setSkillInput] = useState("");
    const [topicInput, setTopicInput] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);

    const formSections = [
        { id: "personal", label: "Personal Info", icon: <FaUserTie className="mr-2" /> },
        { id: "professional", label: "Professional", icon: <FaBriefcase className="mr-2" /> },
        { id: "mentorship", label: "Mentorship", icon: <FaGraduationCap className="mr-2" /> }
    ];

    useEffect(() => {
        const fetchMentorDetails = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/auth/mentor-user`, {
                    method: "GET",
                    headers: { Authorization: authorizationToken }
                });

                if (!response.ok) throw new Error("Failed to fetch mentor details");
                
                const data = await response.json();
                // Ensure skills and topics are strings
                const formattedData = {
                    ...data,
                    skills: typeof data.skills === 'string' ? data.skills : '',
                    mentorshipTopics: typeof data.mentorshipTopics === 'string' ? data.mentorshipTopics : ''
                };
                
                setMentorData(formattedData);
            } catch (err) {
                toast.error(err.message || "Failed to fetch mentor details");
            } finally {
                setInitialLoad(false);
            }
        };

        fetchMentorDetails();
    }, [authorizationToken]);

    const handleChange = (e) => {
        setMentorData({ ...mentorData, [e.target.name]: e.target.value });
    };

    const addSkill = () => {
        if (skillInput.trim()) {
            const currentSkills = mentorData.skills ? mentorData.skills.split(',').map(s => s.trim()) : [];
            if (!currentSkills.includes(skillInput.trim())) {
                const newSkills = [...currentSkills, skillInput.trim()].join(', ');
                setMentorData({
                    ...mentorData,
                    skills: newSkills
                });
                setSkillInput("");
            }
        }
    };

    const addTopic = () => {
        if (topicInput.trim()) {
            const currentTopics = mentorData.mentorshipTopics ? mentorData.mentorshipTopics.split(',').map(t => t.trim()) : [];
            if (!currentTopics.includes(topicInput.trim())) {
                const newTopics = [...currentTopics, topicInput.trim()].join(', ');
                setMentorData({
                    ...mentorData,
                    mentorshipTopics: newTopics
                });
                setTopicInput("");
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        const currentSkills = mentorData.skills.split(',').map(s => s.trim());
        const newSkills = currentSkills.filter(skill => skill !== skillToRemove).join(', ');
        setMentorData({
            ...mentorData,
            skills: newSkills
        });
    };

    const removeTopic = (topicToRemove) => {
        const currentTopics = mentorData.mentorshipTopics.split(',').map(t => t.trim());
        const newTopics = currentTopics.filter(topic => topic !== topicToRemove).join(', ');
        setMentorData({
            ...mentorData,
            mentorshipTopics: newTopics
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
                    Authorization: authorizationToken
                },
                body: JSON.stringify(mentorData)
            });

            if (!response.ok) throw new Error("Failed to update profile");
            const data = await response.json();
            toast.success(data.message || "Profile updated successfully!");
            navigate("/mentor-user");
        } catch (err) {
            toast.error(err.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoad) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Form Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center">
                                <FaPenAlt className="mr-3" />
                                Mentor Profile Setup
                            </h1>
                            <p className="mt-2 opacity-90">
                                Complete your profile to attract mentees and showcase your expertise
                            </p>
                        </div>
                        <div className="hidden md:block bg-white/10 p-2 rounded-lg">
                            <div className="flex space-x-1">
                                {formSections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition ${activeSection === section.id ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'}`}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden bg-gray-100 p-4">
                    <select
                        onChange={(e) => setActiveSection(e.target.value)}
                        value={activeSection}
                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {formSections.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Form Content */}
                <div className="p-6 md:p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Personal Information Section */}
                        {activeSection === "personal" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaUserTie className="mr-2 text-blue-500" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={mentorData.fullName}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaPhone className="mr-2 text-blue-500" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={mentorData.phoneNumber}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="+1 (123) 456-7890"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <IoMdInformationCircleOutline className="mr-2 text-blue-500" />
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={mentorData.bio}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tell us about yourself, your experience, and what you can offer as a mentor..."
                                        required
                                    ></textarea>
                                    <p className="mt-1 text-xs text-gray-500">
                                        This will be displayed on your public profile
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Professional Information Section */}
                        {activeSection === "professional" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaBriefcase className="mr-2 text-blue-500" />
                                            Job Title
                                        </label>
                                        <input
                                            type="text"
                                            name="jobTitle"
                                            value={mentorData.jobTitle}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Senior Software Engineer"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaBuilding className="mr-2 text-blue-500" />
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={mentorData.company}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Tech Corp Inc."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaChartLine className="mr-2 text-blue-500" />
                                            Industry
                                        </label>
                                        <input
                                            type="text"
                                            name="industry"
                                            value={mentorData.industry}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Technology, Healthcare, etc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaChartLine className="mr-2 text-blue-500" />
                                            Years of Experience
                                        </label>
                                        <input
                                            type="number"
                                            name="yearsOfExperience"
                                            value={mentorData.yearsOfExperience}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="5"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <FaLinkedin className="mr-2 text-blue-500" />
                                        LinkedIn Profile URL
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedInUrl"
                                        value={mentorData.linkedInUrl}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://linkedin.com/in/yourprofile"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Mentorship Information Section */}
                        {activeSection === "mentorship" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <FaGraduationCap className="mr-2 text-blue-500" />
                                        Skills
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Add a skill (e.g., React, Leadership)"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addSkill}
                                            className="bg-blue-500 text-white px-4 py-3 rounded-r-lg hover:bg-blue-600 transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {mentorData.skills && mentorData.skills.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {mentorData.skills.split(',').map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                                                >
                                                    {skill.trim()}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(skill.trim())}
                                                        className="ml-1 text-blue-500 hover:text-blue-700"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <FaGraduationCap className="mr-2 text-blue-500" />
                                        Mentorship Topics
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            value={topicInput}
                                            onChange={(e) => setTopicInput(e.target.value)}
                                            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Add a topic (e.g., Career Advice, Technical Interviews)"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addTopic}
                                            className="bg-blue-500 text-white px-4 py-3 rounded-r-lg hover:bg-blue-600 transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {mentorData.mentorshipTopics && mentorData.mentorshipTopics.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {mentorData.mentorshipTopics.split(',').map((topic, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                                                >
                                                    {topic.trim()}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTopic(topic.trim())}
                                                        className="ml-1 text-indigo-500 hover:text-indigo-700"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Navigation and Submit */}
                        <div className="mt-10 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                            <div className="flex space-x-3">
                                {formSections.map((section) => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => setActiveSection(section.id)}
                                        className={`p-2 rounded-full ${activeSection === section.id ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                        title={section.label}
                                    >
                                        {section.icon}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    "Save Profile"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default MentorUpdate;
