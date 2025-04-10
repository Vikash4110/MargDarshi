import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaBriefcase,
  FaBuilding,
  FaChartLine,
  FaLinkedin,
  FaGraduationCap,
  FaKey,
  FaFileUpload,
  FaUserCircle,
  FaCheck,
  FaArrowLeft,
  FaArrowRight
} from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MentorRegister = () => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    jobTitle: "",
    industry: "",
    yearsOfExperience: "",
    company: "",
    linkedInUrl: "",
    skills: [],
    mentorshipTopics: [],
    bio: "",
    termsAccepted: false
  });
  const [newSkill, setNewSkill] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const stepTitles = [
    "Personal Information",
    "Professional Details",
    "Skills",
    "Mentorship Topics",
    "Profile Setup",
    "Email Verification"
  ];

  const stepIcons = [
    <FaUser className="text-teal-500" />,
    <FaBriefcase className="text-teal-500" />,
    <FaGraduationCap className="text-teal-500" />,
    <FaChartLine className="text-teal-500" />,
    <FaFileUpload className="text-teal-500" />,
    <FaKey className="text-teal-500" />
  ];

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !user.skills.includes(trimmedSkill)) {
      setUser(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill]
      }));
      setNewSkill("");
    }
  };

  const handleAddTopic = () => {
    const trimmedTopic = newTopic.trim();
    if (trimmedTopic && !user.mentorshipTopics.includes(trimmedTopic)) {
      setUser(prev => ({
        ...prev,
        mentorshipTopics: [...prev.mentorshipTopics, trimmedTopic]
      }));
      setNewTopic("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setUser(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleRemoveTopic = (topic) => {
    setUser(prev => ({
      ...prev,
      mentorshipTopics: prev.mentorshipTopics.filter(t => t !== topic)
    }));
  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }
    setFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.termsAccepted) {
      toast.error("Please accept the terms and conditions to proceed.");
      return;
    }
    if (user.skills.length === 0 || user.mentorshipTopics.length === 0) {
      toast.error("Please add at least one skill and one mentorship topic.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(user).forEach(([key, value]) => {
        formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
      });
      if (profilePicture) formData.append("profilePicture", profilePicture);

      const response = await fetch(`${backendUrl}/api/auth/mentor-register`, {
        method: "POST",
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok) {
        let errorMessage = "Registration failed";
        if (resData.message) {
          errorMessage = resData.message;
          if (resData.message.includes("email") || resData.message.includes("Email")) {
            errorMessage = "This email is already registered.";
          }
        }
        throw new Error(errorMessage);
      }

      toast.success("An OTP has been sent to your email. Please verify it.");
      setStep(6);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP sent to your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, otp }),
      });
      const resData = await response.json();

      if (!response.ok) {
        let errorMessage = "OTP verification failed";
        if (resData.message) {
          errorMessage = resData.message.includes("Invalid") || resData.message.includes("expired") 
            ? "The OTP is incorrect or has expired." 
            : resData.message;
        }
        throw new Error(errorMessage);
      }

      storeTokenInLS(resData.token);
      toast.success("Welcome! Redirecting to your dashboard...");
      setTimeout(() => navigate("/mentor-show"), 1500);
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <FaUserCircle className="text-2xl" />
                Mentor Registration
              </h1>
              <p className="text-teal-100 mt-1">Share your knowledge and guide the next generation</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaBriefcase className="text-xl" />
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center ${index < step ? 'text-teal-600' : 'text-gray-400'}`}
                onClick={() => step > index + 1 && setStep(index + 1)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  step > index + 1 ? 'bg-teal-100' : step === index + 1 ? 'bg-teal-600 text-white' : 'bg-gray-100'
                }`}>
                  {step > index + 1 ? <FaCheck className="text-teal-600" /> : stepIcons[index]}
                </div>
                <span className="text-xs font-medium text-center">{title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                {stepIcons[step - 1]}
                {stepTitles[step - 1]}
              </h2>

              {step === 1 && (
                <div className="space-y-4">
                  <InputField
                    icon={<FaUser className="text-gray-500" />}
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleInput}
                    placeholder="Full Name"
                    required
                  />
                  <InputField
                    icon={<FaEnvelope className="text-gray-500" />}
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInput}
                    placeholder="Email"
                    required
                  />
                  <InputField
                    icon={<FaLock className="text-gray-500" />}
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInput}
                    placeholder="Password"
                    required
                  />
                  <InputField
                    icon={<FaPhone className="text-gray-500" />}
                    type="text"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleInput}
                    placeholder="Phone Number"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <InputField
                    icon={<FaBriefcase className="text-gray-500" />}
                    type="text"
                    name="jobTitle"
                    value={user.jobTitle}
                    onChange={handleInput}
                    placeholder="Job Title"
                    required
                  />
                  <InputField
                    icon={<FaBuilding className="text-gray-500" />}
                    type="text"
                    name="company"
                    value={user.company}
                    onChange={handleInput}
                    placeholder="Company"
                  />
                  <InputField
                    icon={<FaChartLine className="text-gray-500" />}
                    type="text"
                    name="industry"
                    value={user.industry}
                    onChange={handleInput}
                    placeholder="Industry"
                    required
                  />
                  <InputField
                    icon={<FaChartLine className="text-gray-500" />}
                    type="number"
                    name="yearsOfExperience"
                    value={user.yearsOfExperience}
                    onChange={handleInput}
                    placeholder="Years of Experience"
                    required
                  />
                  <InputField
                    icon={<FaLinkedin className="text-gray-500" />}
                    type="url"
                    name="linkedInUrl"
                    value={user.linkedInUrl}
                    onChange={handleInput}
                    placeholder="LinkedIn Profile URL"
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <TagInput
                    label="Skills"
                    newItem={newSkill}
                    setNewItem={setNewSkill}
                    handleAdd={handleAddSkill}
                    items={user.skills}
                    handleRemove={handleRemoveSkill}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <TagInput
                    label="Mentorship Topics"
                    newItem={newTopic}
                    setNewItem={setNewTopic}
                    handleAdd={handleAddTopic}
                    items={user.mentorshipTopics}
                    handleRemove={handleRemoveTopic}
                  />
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                    <textarea
                      name="bio"
                      value={user.bio}
                      onChange={handleInput}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 resize-none"
                      rows={4}
                      placeholder="Tell us about your professional background and mentoring approach..."
                    />
                  </div>
                  <FileUpload
                    icon={<FaUserCircle className="text-teal-500" />}
                    label="Profile Picture"
                    name="profilePicture"
                    onChange={(e) => handleFileChange(e, setProfilePicture)}
                    fileName={profilePicture?.name}
                  />
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={user.termsAccepted}
                      onChange={handleInput}
                      className="h-5 w-5 text-teal-600 mt-1"
                      required
                    />
                    <label className="text-gray-700 text-sm">
                      I agree to the <a href="#" className="text-teal-600 hover:underline">Terms of Service</a> and <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-4 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <FaEnvelope className="text-blue-500 text-3xl mx-auto mb-2" />
                    <h3 className="font-medium text-blue-800">Verify Your Email</h3>
                    <p className="text-blue-600 text-sm mt-1">
                      We've sent a verification code to <span className="font-medium">{user.email}</span>
                    </p>
                  </div>
                  <InputField
                    icon={<FaKey className="text-gray-500" />}
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                </div>
              )}

              <div className="flex justify-between gap-4 pt-4">
                {step > 1 && (
                  <motion.button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaArrowLeft />
                    Back
                  </motion.button>
                )}
                {step < 5 ? (
                  <motion.button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                    <FaArrowRight />
                  </motion.button>
                ) : step === 5 ? (
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-medium ${
                      loading ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-700"
                    } transition-all`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-medium ${
                      loading ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-700"
                    } transition-all`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? "Verifying..." : "Verify & Complete"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Components
const InputField = ({ icon, ...props }) => (
  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
    {icon}
    <input 
      {...props} 
      className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
    />
  </div>
);

const TagInput = ({ label, newItem, setNewItem, handleAdd, items, handleRemove }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex gap-2">
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
        placeholder={`Add ${label}`}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
      >
        Add
      </button>
    </div>
    {items.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center bg-teal-100 text-teal-800 py-1 px-3 rounded-full text-sm">
            {item}
            <button
              type="button"
              onClick={() => handleRemove(item)}
              className="ml-2 text-teal-600 hover:text-teal-800"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

const FileUpload = ({ icon, label, name, onChange, fileName }) => (
  <div className="border border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-400 transition-all">
    <div className="flex items-center gap-3">
      <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
        {icon}
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-teal-600 text-white py-1 px-3 rounded-md hover:bg-teal-700 transition-all text-sm font-medium">
            Choose File
            <input 
              type="file" 
              name={name}
              onChange={onChange}
              className="hidden" 
            />
          </label>
          {fileName && (
            <span className="text-sm text-gray-600 truncate">{fileName}</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default MentorRegister;