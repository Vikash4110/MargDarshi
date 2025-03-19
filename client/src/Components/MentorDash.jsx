// src/pages/MentorDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUser, FaPhone, FaBuilding, FaEnvelope, FaListOl, FaSignOutAlt, FaIdCard, FaBriefcase } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MentorDashboard = () => {
  const { user, logoutUser } = useAuth();
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
    skills: [],
    mentorshipTopics: [],
    bio: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [identityProof, setIdentityProof] = useState(null);
  const [workplaceProof, setWorkplaceProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/auth/mentor-user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch data");
        setMentorData({
          fullName: data.fullName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          jobTitle: data.jobTitle || "",
          industry: data.industry || "",
          yearsOfExperience: data.yearsOfExperience || "",
          company: data.company || "",
          linkedInUrl: data.linkedInUrl || "",
          skills: data.skills || [],
          mentorshipTopics: data.mentorshipTopics || [],
          bio: data.bio || "",
        });
      } catch (err) {
        toast.error(err.message);
        if (err.message.includes("Unauthorized")) logoutUser();
      } finally {
        setLoading(false);
      }
    };
    fetchMentorData();
  }, [logoutUser]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setMentorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !mentorData.skills.includes(trimmedSkill)) {
      setMentorData((prev) => ({ ...prev, skills: [...prev.skills, trimmedSkill] }));
      setNewSkill("");
    }
  };

  const handleAddTopic = () => {
    const trimmedTopic = newTopic.trim();
    if (trimmedTopic && !mentorData.mentorshipTopics.includes(trimmedTopic)) {
      setMentorData((prev) => ({ ...prev, mentorshipTopics: [...prev.mentorshipTopics, trimmedTopic] }));
      setNewTopic("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setMentorData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const handleRemoveTopic = (topic) => {
    setMentorData((prev) => ({ ...prev, mentorshipTopics: prev.mentorshipTopics.filter((t) => t !== topic) }));
  };

  const handleFileChange = (e, setFile, displayId) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setFile(file);
    const fileName = file?.name;
    if (fileName) {
      const fileDisplay = document.getElementById(displayId);
      fileDisplay.textContent = fileName;
      fileDisplay.classList.remove("hidden");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mentorData.skills.length === 0 || mentorData.mentorshipTopics.length === 0) {
      toast.error("Please add at least one skill and one mentorship topic.");
      return;
    }
    if (!identityProof || !workplaceProof) {
      toast.error("Please upload both identity proof and workplace proof.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(mentorData).forEach(([key, value]) => {
        formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
      });
      if (profilePicture) formData.append("profilePicture", profilePicture);
      formData.append("identityProof", identityProof);
      formData.append("workplaceProof", workplaceProof);

      const response = await fetch(`${backendUrl}/api/auth/mentor-update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const resData = await response.json();

      if (!response.ok) throw new Error(resData.message || "Failed to update profile");

      toast.success("Profile submitted for admin verification!");
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/mentor-login");
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-600" /></div>;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#0f6f5c]">Mentor Dashboard</h1>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </div>

        {user.verificationStatus === "pending" && (
          <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-700">
            Your profile is pending admin verification. Please complete and submit your details below.
          </div>
        )}

        {user.verificationStatus === "rejected" && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
            Your profile was rejected. Reason: {user.verificationReason || "No reason provided."}. Please update and resubmit.
          </div>
        )}

        {user.verificationStatus === "verified" && (
          <div className="mb-8 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700">
            Your profile is verified! You can now access all mentoring features.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField icon={faUser} type="text" name="fullName" value={mentorData.fullName} onChange={handleInput} placeholder="Full Name" required />
          <InputField icon={faEnvelope} type="email" name="email" value={mentorData.email} onChange={handleInput} placeholder="Email" required disabled />
          <InputField icon={faPhone} type="text" name="phoneNumber" value={mentorData.phoneNumber} onChange={handleInput} placeholder="Phone Number" required />
          <InputField icon={faBuilding} type="text" name="jobTitle" value={mentorData.jobTitle} onChange={handleInput} placeholder="Job Title" required />
          <InputField icon={faBuilding} type="text" name="industry" value={mentorData.industry} onChange={handleInput} placeholder="Industry" required />
          <InputField icon={faListOl} type="number" name="yearsOfExperience" value={mentorData.yearsOfExperience} onChange={handleInput} placeholder="Years of Experience" required />
          <InputField icon={faBuilding} type="text" name="company" value={mentorData.company} onChange={handleInput} placeholder="Company" required />
          <InputField icon={faUser} type="url" name="linkedInUrl" value={mentorData.linkedInUrl} onChange={handleInput} placeholder="LinkedIn URL" />
          
          <SkillTopicInput label="Skills" newItem={newSkill} setNewItem={setNewSkill} handleAdd={handleAddSkill} items={mentorData.skills} handleRemove={handleRemoveSkill} />
          <SkillTopicInput label="Mentorship Topics" newItem={newTopic} setNewItem={setNewTopic} handleAdd={handleAddTopic} items={mentorData.mentorshipTopics} handleRemove={handleRemoveTopic} />
          
          <textarea
            name="bio"
            value={mentorData.bio}
            onChange={handleInput}
            className="w-full rounded-xl border border-gray-200 p-4 focus:outline-none focus:ring-2 focus:ring-[#0f6f5c] bg-gray-50 resize-none"
            placeholder="Write a brief bio"
            rows={5}
          />

          <FileInput label="Profile Picture" id="file-upload-profile" onChange={(e) => handleFileChange(e, setProfilePicture, "file-display-profile")} />
          <FileInput label="Identity Proof (Aadhar/PAN/Passport)" id="file-upload-identity" onChange={(e) => handleFileChange(e, setIdentityProof, "file-display-identity")} accept="image/*,application/pdf" />
          <FileInput label="Workplace Proof" id="file-upload-workplace" onChange={(e) => handleFileChange(e, setWorkplaceProof, "file-display-workplace")} accept="image/*,application/pdf" />

          <motion.button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-xl shadow-md ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0e5f4c]"} transition-all font-semibold`}
            whileHover={{ scale: submitting ? 1 : 1.05 }}
            whileTap={{ scale: submitting ? 1 : 0.95 }}
          >
            {submitting ? "Submitting..." : "Submit Profile"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

const InputField = ({ icon, ...props }) => (
  <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl shadow-sm py-3 px-5 focus-within:ring-2 focus-within:ring-[#0f6f5c]">
    <FontAwesomeIcon icon={icon} className="text-gray-500" />
    <input {...props} className="w-full focus:outline-none bg-transparent" />
  </div>
);

const SkillTopicInput = ({ label, newItem, setNewItem, handleAdd, items, handleRemove }) => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-4 items-center">
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f6f5c] bg-gray-50"
        placeholder={`Add ${label}`}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="px-6 py-3 bg-[#0f6f5c] text-white rounded-lg hover:bg-[#0e5f4c] transition-all font-semibold"
      >
        Add
      </button>
    </div>
    <div className="flex flex-wrap gap-2 mt-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center bg-teal-100 py-1 px-3 rounded-full text-teal-800">
          <span>{item}</span>
          <button type="button" onClick={() => handleRemove(item)} className="ml-2 text-teal-600 hover:text-teal-800">
            ×
          </button>
        </div>
      ))}
    </div>
  </div>
);

const FileInput = ({ label, id, onChange, accept }) => (
  <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl shadow-sm py-3 px-5 focus-within:ring-2 focus-within:ring-[#0f6f5c]">
    <input type="file" onChange={onChange} className="hidden" id={id} accept={accept} />
    <label
      htmlFor={id}
      className="cursor-pointer bg-[#0f6f5c] text-white py-2 px-4 rounded-lg hover:bg-[#0e5f4c] transition-all font-semibold"
    >
      {label}
    </label>
    <div id={`file-display-${id.split("-")[2]}`} className="hidden flex items-center gap-2 text-[#0f6f5c]">
      <span>✔</span>
      <span className="text-sm"></span>
    </div>
  </div>
);

export default MentorDashboard;