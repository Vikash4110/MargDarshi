import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../store/auth";

import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faPhone,
  faBuilding,
  faEnvelope,
  faListOl,
} from "@fortawesome/free-solid-svg-icons";

import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MentorRegister = () => {
  const navigate = useNavigate();

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
  });

  const [newSkill, setNewSkill] = useState("");

  const [newTopic, setNewTopic] = useState("");

  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);

  const { storeTokenInLS } = useAuth();

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();

    if (trimmedSkill && !user.skills.includes(trimmedSkill)) {
      setUser((prev) => ({
        ...prev,

        skills: [...prev.skills, trimmedSkill],
      }));

      setNewSkill("");
    }
  };

  const handleAddTopic = () => {
    const trimmedTopic = newTopic.trim();

    if (trimmedTopic && !user.mentorshipTopics.includes(trimmedTopic)) {
      setUser((prev) => ({
        ...prev,

        mentorshipTopics: [...prev.mentorshipTopics, trimmedTopic],
      }));

      setNewTopic("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setUser((prev) => ({
      ...prev,

      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleRemoveTopic = (topic) => {
    setUser((prev) => ({
      ...prev,

      mentorshipTopics: prev.mentorshipTopics.filter((t) => t !== topic),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!backendUrl) {
      toast.error(
        "Backend URL is not defined. Please check your environment variables."
      );

      return;
    }

    setLoading(true);

    try {
      const formData = {
        ...user,

        skills: user.skills.length ? user.skills : [],

        mentorshipTopics: user.mentorshipTopics.length
          ? user.mentorshipTopics
          : [],

        yearsOfExperience: Number(user.yearsOfExperience),
      };

      const response = await fetch(`${backendUrl}/api/auth/mentor-register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(
          resData.extraDetails || resData.message || "Registration failed"
        );
      }

      storeTokenInLS(resData.token);

      toast.success("Registered Successfully");

      setUser({
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
      });

      navigate("/mentor-show");
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-4">
    <h1 className="text-black text-5xl font-bold text-center mb-6">Mentor Register</h1>
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 lg:p-12"
    >
        {/* Progress Indicator */}

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= s
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Personal Information */}

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <InputField
              icon={faUser}
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleInput}
              placeholder="Full Name"
              required
            />

            <InputField
              icon={faEnvelope}
              type="email"
              name="email"
              value={user.email}
              onChange={handleInput}
              placeholder="Email"
              required
            />

            <InputField
              icon={faUser}
              type="password"
              name="password"
              value={user.password}
              onChange={handleInput}
              placeholder="Password"
              required
            />

            <InputField
              icon={faPhone}
              type="text"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleInput}
              placeholder="Phone Number"
              required
            />

            <div className="flex justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Job and Company Information */}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <InputField
              icon={faBuilding}
              type="text"
              name="jobTitle"
              value={user.jobTitle}
              onChange={handleInput}
              placeholder="Job Title"
              required
            />

            <InputField
              icon={faBuilding}
              type="text"
              name="industry"
              value={user.industry}
              onChange={handleInput}
              placeholder="Industry"
              required
            />

            <InputField
              icon={faListOl}
              type="number"
              name="yearsOfExperience"
              value={user.yearsOfExperience}
              onChange={handleInput}
              placeholder="Years of Experience"
              required
            />

            <InputField
              icon={faBuilding}
              type="text"
              name="company"
              value={user.company}
              onChange={handleInput}
              placeholder="Company"
            />

            <InputField
              icon={faUser}
              type="url"
              name="linkedInUrl"
              value={user.linkedInUrl}
              onChange={handleInput}
              placeholder="LinkedIn URL"
            />

            <div className="flex justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Skills */}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <SkillTopicInput
              label="Skills"
              newItem={newSkill}
              setNewItem={setNewSkill}
              handleAdd={handleAddSkill}
              items={user.skills}
              handleRemove={handleRemoveSkill}
            />

            <div className="flex justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Mentorship Topics */}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <SkillTopicInput
              label="Mentorship Topics"
              newItem={newTopic}
              setNewItem={setNewTopic}
              handleAdd={handleAddTopic}
              items={user.mentorshipTopics}
              handleRemove={handleRemoveTopic}
            />

            <div className="flex justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(5)}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Bio Section */}

        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <textarea
              name="bio"
              value={user.bio}
              onChange={handleInput}
              className="w-full rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Write a brief bio"
              rows={5}
            />

            <div className="flex justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-red-700 hover:to-red-800"
                } transition-all`}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};

const InputField = ({ icon, ...props }) => (
  <div className="flex items-center gap-4 bg-white border border-gray-300 rounded-2xl shadow-sm py-3 px-5 focus-within:ring-2 focus-within:ring-red-600">
    <FontAwesomeIcon icon={icon} className="text-gray-500" />

    <input {...props} className="w-full focus:outline-none" />
  </div>
);

const SkillTopicInput = ({
  label,
  newItem,
  setNewItem,
  handleAdd,
  items,
  handleRemove,
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-4 items-center">
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
        placeholder={`Add ${label}`}
      />

      <button
        type="button"
        onClick={handleAdd}
        className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
      >
        Add
      </button>
    </div>

    <div className="flex flex-wrap gap-2 mt-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center bg-gray-200 py-1 px-3 rounded-full"
        >
          <span>{item}</span>

          <button
            type="button"
            onClick={() => handleRemove(item)}
            className="ml-2 text-red-600 hover:text-red-700"
          >
            x
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default MentorRegister;
