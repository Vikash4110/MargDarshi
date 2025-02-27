import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faBuilding,
  faEnvelope,
  faGraduationCap,
  faUniversity,
  faBook,
  faCalendar,
  faLock,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import RegisterImg from "../assets/vecteezy_white-clipboard-task-management-todo-check-list-efficient_9315274.png";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MenteeRegister = () => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    currentEducationLevel: "",
    universityName: "",
    fieldOfStudy: "",
    expectedGraduationYear: "",
    careerInterests: [],
    desiredIndustry: [],
    skillsToDevelop: [],
    typeOfMentorshipSought: [],
    preferredDaysAndTimes: [],
    preferredMentorshipMode: "",
    personalIntroduction: "",
    linkedInProfileUrl: "",
  });
  const [newCareerInterest, setNewCareerInterest] = useState("");
  const [newIndustry, setNewIndustry] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newMentorshipType, setNewMentorshipType] = useState("");
  const [newDayTime, setNewDayTime] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (field, newItem, setNewItem) => {
    const trimmedItem = newItem.trim();
    if (trimmedItem && !user[field].includes(trimmedItem)) {
      setUser((prev) => ({
        ...prev,
        [field]: [...prev[field], trimmedItem],
      }));
      setNewItem("");
    }
  };

  const handleRemoveItem = (field, item) => {
    setUser((prev) => ({
      ...prev,
      [field]: prev[field].filter((i) => i !== item),
    }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
    const fileName = e.target.files[0]?.name;
    if (fileName) {
      const fileDisplay = document.getElementById("file-display");
      fileDisplay.textContent = fileName;
      fileDisplay.classList.remove("hidden");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.skillsToDevelop.length === 0 || user.typeOfMentorshipSought.length === 0) {
      toast.error("Please add at least one skill to develop and one mentorship type.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(user).forEach(([key, value]) => {
        formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
      });
      if (profilePicture) formData.append("profilePicture", profilePicture);

      const response = await fetch(`${backendUrl}/api/auth/mentee-register`, {
        method: "POST",
        body: formData,
      });
      const resData = await response.json();

      if (!response.ok) {
        if (resData.status === 422 && resData.extraDetails) {
          const errorDetails = Array.isArray(resData.extraDetails) ? resData.extraDetails.join("\n") : resData.extraDetails;
          throw new Error(errorDetails);
        }
        throw new Error(resData.message || "Registration failed");
      }

      setStep(5); // Move to OTP verification step
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.", { style: { whiteSpace: "pre-wrap" } });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, otp }),
      });
      const resData = await response.json();

      if (!response.ok) throw new Error(resData.message || "OTP verification failed");

      storeTokenInLS(resData.token);
      toast.success("Registered Successfully");
      setUser({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        currentEducationLevel: "",
        universityName: "",
        fieldOfStudy: "",
        expectedGraduationYear: "",
        careerInterests: [],
        desiredIndustry: [],
        skillsToDevelop: [],
        typeOfMentorshipSought: [],
        preferredDaysAndTimes: [],
        preferredMentorshipMode: "",
        personalIntroduction: "",
        linkedInProfileUrl: "",
      });
      setProfilePicture(null);
      setOtp("");
      navigate("/mentee-main");
    } catch (error) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const resData = await response.json();

      if (!response.ok) throw new Error(resData.message || "Failed to send OTP");
      toast.success("OTP sent to your email for password reset.");
      setStep(2); // Move to reset password step
    } catch (error) {
      toast.error(error.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, otp: resetOtp, newPassword }),
      });
      const resData = await response.json();

      if (!response.ok) throw new Error(resData.message || "Failed to reset password");
      toast.success("Password reset successfully. Please log in.");
      setForgotPassword(false);
      setResetOtp("");
      setNewPassword("");
      setStep(1);
      navigate("/mentee-login");
    } catch (error) {
      toast.error(error.message || "Invalid OTP or error resetting password");
    } finally {
      setLoading(false);
    }
  };

  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 flex items-center justify-center p-6 lg:p-12 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      <motion.div
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <motion.h1
            className="text-4xl lg:text-5xl font-extrabold text-[#0f6f5c] text-center mb-8 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {forgotPassword ? "Reset Password" : "Join as Mentee"}
          </motion.h1>

          <motion.div
            className="mb-8 flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {!forgotPassword && step <= 4 && [1, 2, 3, 4].map((s) => (
              <motion.div
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= s ? "bg-[#0f6f5c] text-white" : "bg-gray-200 text-gray-500"}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {s}
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 && !forgotPassword && (
              <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <InputField icon={faUser} type="text" name="fullName" value={user.fullName} onChange={handleInput} placeholder="Full Name" required />
                <InputField icon={faEnvelope} type="email" name="email" value={user.email} onChange={handleInput} placeholder="Email" required />
                <InputField icon={faLock} type="password" name="password" value={user.password} onChange={handleInput} placeholder="Password" required />
                <InputField icon={faPhone} type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleInput} placeholder="Phone Number" />
                <div className="flex justify-between gap-4 mt-8">
                  <motion.button
                    type="button"
                    onClick={() => navigate("/")}
                    className="w-full py-3 px-4 bg-gray-300 text-gray-700 rounded-xl shadow-md hover:bg-gray-400 transition-all font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-xl shadow-md hover:bg-[#0e5f4c] transition-all font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                  </motion.button>
                </div>
                <motion.p
                  className="text-center text-sm text-gray-600 cursor-pointer hover:text-[#0f6f5c]"
                  onClick={() => setForgotPassword(true)}
                  whileHover={{ scale: 1.05 }}
                >
                  Forgot Password?
                </motion.p>
              </motion.div>
            )}

            {step === 2 && !forgotPassword && (
              <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <InputField icon={faGraduationCap} type="text" name="currentEducationLevel" value={user.currentEducationLevel} onChange={handleInput} placeholder="Current Education Level" />
                <InputField icon={faUniversity} type="text" name="universityName" value={user.universityName} onChange={handleInput} placeholder="University Name" />
                <InputField icon={faBook} type="text" name="fieldOfStudy" value={user.fieldOfStudy} onChange={handleInput} placeholder="Field of Study" />
                <InputField icon={faCalendar} type="number" name="expectedGraduationYear" value={user.expectedGraduationYear} onChange={handleInput} placeholder="Expected Graduation Year" />
                <div className="flex justify-between gap-4 mt-8">
                  <motion.button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full py-3 px-4 bg-gray-300 text-gray-700 rounded-xl shadow-md hover:bg-gray-400 transition-all font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-xl shadow-md hover:bg-[#0e5f4c] transition-all font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && !forgotPassword && (
              <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <SkillTopicInput
                  label="Career Interests"
                  newItem={newCareerInterest}
                  setNewItem={setNewCareerInterest}
                  handleAdd={() => handleAddItem("careerInterests", newCareerInterest, setNewCareerInterest)}
                  items={user.careerInterests}
                  handleRemove={(item) => handleRemoveItem("careerInterests", item)}
                />
                <SkillTopicInput
                  label="Desired Industry"
                  newItem={newIndustry}
                  setNewItem={setNewIndustry}
                  handleAdd={() => handleAddItem("desiredIndustry", newIndustry, setNewIndustry)}
                  items={user.desiredIndustry}
                  handleRemove={(item) => handleRemoveItem("desiredIndustry", item)}
                />
                <SkillTopicInput
                  label="Skills to Develop"
                  newItem={newSkill}
                  setNewItem={setNewSkill}
                  handleAdd={() => handleAddItem("skillsToDevelop", newSkill, setNewSkill)}
                  items={user.skillsToDevelop}
                  handleRemove={(item) => handleRemoveItem("skillsToDevelop", item)}
                />
                <div className="flex justify-between gap-4 mt-8">
                  <motion.button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3 px-4 bg-gray-300 text-gray-700 rounded-xl shadow-md hover:bg-gray-400 transition-all font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setStep(4)}
                    className="w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-xl shadow-md hover:bg-[#0e5f4c] transition-all font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 4 && !forgotPassword && (
              <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <SkillTopicInput
                  label="Type of Mentorship Sought"
                  newItem={newMentorshipType}
                  setNewItem={setNewMentorshipType}
                  handleAdd={() => handleAddItem("typeOfMentorshipSought", newMentorshipType, setNewMentorshipType)}
                  items={user.typeOfMentorshipSought}
                  handleRemove={(item) => handleRemoveItem("typeOfMentorshipSought", item)}
                />
                <SkillTopicInput
                  label="Preferred Days and Times"
                  newItem={newDayTime}
                  setNewItem={setNewDayTime}
                  handleAdd={() => handleAddItem("preferredDaysAndTimes", newDayTime, setNewDayTime)}
                  items={user.preferredDaysAndTimes}
                  handleRemove={(item) => handleRemoveItem("preferredDaysAndTimes", item)}
                />
                <InputField icon={faBuilding} type="text" name="preferredMentorshipMode" value={user.preferredMentorshipMode} onChange={handleInput} placeholder="Preferred Mentorship Mode" />
                <textarea
                  name="personalIntroduction"
                  value={user.personalIntroduction}
                  onChange={handleInput}
                  className="w-full rounded-xl border border-gray-200 p-4 focus:outline-none focus:ring-2 focus:ring-[#0f6f5c] bg-gray-50 resize-none"
                  placeholder="Personal Introduction"
                  rows={5}
                />
                <InputField icon={faUser} type="url" name="linkedInProfileUrl" value={user.linkedInProfileUrl} onChange={handleInput} placeholder="LinkedIn Profile URL" />
                <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl shadow-sm py-3 px-5 focus-within:ring-2 focus-within:ring-[#0f6f5c]">
                  <input type="file" name="profilePicture" onChange={handleFileChange} className="hidden" id="file-upload" />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-[#0f6f5c] text-white py-2 px-4 rounded-lg hover:bg-[#0e5f4c] transition-all font-semibold"
                  >
                    Upload Profile Picture
                  </label>
                  <div id="file-display" className="hidden flex items-center gap-2 text-[#0f6f5c]">
                    <span>✔</span>
                    <span className="text-sm"></span>
                  </div>
                </div>
                <div className="flex justify-between gap-4 mt-8">
                  <motion.button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full py-3 px-4 bg-gray-300 text-gray-700 rounded-xl shadow-md hover:bg-gray-400 transition-all font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-xl shadow-md ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0e5f4c]"} transition-all font-semibold`}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                  >
                    {loading ? "Registering..." : "Register"}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 5 && !forgotPassword && (
              <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#0f6f5c] text-center">Verify Your Email</h2>
                <p className="text-gray-600 text-center">An OTP has been sent to {user.email}. Please enter it below.</p>
                <InputField icon={faKey} type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
                <motion.button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className={`w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-xl shadow-md ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0e5f4c]"} transition-all font-semibold`}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </motion.button>
              </motion.div>
            )}

            {forgotPassword && step === 1 && (
              <motion.div key="forgot" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <InputField icon={faEnvelope} type="email" name="email" value={user.email} onChange={handleInput} placeholder="Enter your email" required />
                <motion.button
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className={`w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-xl shadow-md ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0e5f4c]"} transition-all font-semibold`}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </motion.button>
                <motion.p
                  className="text-center text-sm text-gray-600 cursor-pointer hover:text-[#0f6f5c]"
                  onClick={() => { setForgotPassword(false); setStep(1); }}
                  whileHover={{ scale: 1.05 }}
                >
                  Back to Registration
                </motion.p>
              </motion.div>
            )}

            {forgotPassword && step === 2 && (
              <motion.div key="reset" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#0f6f5c] text-center">Reset Password</h2>
                <p className="text-gray-600 text-center">Enter the OTP sent to {user.email} and your new password.</p>
                <InputField icon={faKey} type="text" value={resetOtp} onChange={(e) => setResetOtp(e.target.value)} placeholder="Enter OTP" required />
                <InputField icon={faLock} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" required />
                <motion.button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className={`w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-xl shadow-md ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0e5f4c]"} transition-all font-semibold`}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </motion.button>
                <motion.p
                  className="text-center text-sm text-gray-600 cursor-pointer hover:text-[#0f6f5c]"
                  onClick={() => { setForgotPassword(false); setStep(1); }}
                  whileHover={{ scale: 1.05 }}
                >
                  Back to Registration
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="hidden lg:flex w-1/2 justify-center items-center bg-gradient-to-br from-[#0f6f5c] to-teal-500 rounded-r-3xl"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img src={RegisterImg} alt="Mentee Register" className="w-3/4 h-auto object-contain" />
        </motion.div>
      </motion.div>
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

export default MenteeRegister;