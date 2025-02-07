import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMobile,
  faBuilding,
  faListOl,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion"; // Import Framer Motion for transitions

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MentorRegister = ({ setIsLoggedIn }) => {
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
  const [step, setStep] = useState(1); // Manage form step
  const { storeTokenInLS } = useAuth();

  // Handle input changes
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Add skill to skills array
  const handleAddSkill = () => {
    if (newSkill.trim() && !user.skills.includes(newSkill.trim())) {
      setUser((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  // Add topic to mentorship topics array
  const handleAddTopic = () => {
    if (newTopic.trim() && !user.mentorshipTopics.includes(newTopic.trim())) {
      setUser((prev) => ({
        ...prev,
        mentorshipTopics: [...prev.mentorshipTopics, newTopic.trim()],
      }));
      setNewTopic("");
    }
  };

  // Remove skill
  const handleRemoveSkill = (index) => {
    const updatedSkills = user.skills.filter((_, i) => i !== index);
    setUser((prev) => ({ ...prev, skills: updatedSkills }));
  };

  // Remove mentorship topic
  const handleRemoveTopic = (index) => {
    const updatedTopics = user.mentorshipTopics.filter((_, i) => i !== index);
    setUser((prev) => ({ ...prev, mentorshipTopics: updatedTopics }));
  };

  // Handle next step
  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  // Handle previous step
  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!backendUrl) {
      toast.error("Backend URL is not defined. Please check your environment variables.");
    }

    setLoading(true);

    try {
      const formattedUser = {
        ...user,
        yearsOfExperience: Number(user.yearsOfExperience), // Parse to number
      };

      const response = await fetch(`${backendUrl}/api/auth/mentor-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedUser),
      });

      const res_data = await response.json();

      if (!response.ok) {
        throw new Error(res_data.extraDetails || res_data.message || "Registration failed");
      }

      storeTokenInLS(res_data.token);
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
      toast.success("Registered Successfully");
      navigate("/mentor-user");
    } catch (error) {
      console.error("Registration error: ", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-lg mx-auto mt-6 text-center border-2 rounded-3xl py-10 lg:py-12 px-6 lg:px-10 shadow-2xl"
    >
      {/* Step 1: Personal Information */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
          <button
            type="button"
            className="w-full py-3 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 mt-4"
            onClick={nextStep}
          >
            Next
          </button>
        </motion.div>
      )}

      {/* Step 2: Job and Company Information */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
          <button
            type="button"
            className="w-full py-3 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 mt-4"
            onClick={nextStep}
          >
            Next
          </button>
          <button
            type="button"
            className="w-full py-3 px-4 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 mt-4"
            onClick={prevStep}
          >
            Back
          </button>
        </motion.div>
      )}

      {/* Step 3: Add Skills */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SkillTopicInput
            label="Skills"
            newItem={newSkill}
            setNewItem={setNewSkill}
            handleAdd={handleAddSkill}
            items={user.skills}
            handleRemove={handleRemoveSkill}
          />
          <button
            type="button"
            className="w-full py-3 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 mt-4"
            onClick={nextStep}
          >
            Next
          </button>
          <button
            type="button"
            className="w-full py-3 px-4 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 mt-4"
            onClick={prevStep}
          >
            Back
          </button>
        </motion.div>
      )}

      {/* Step 4: Add Mentorship Topics */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SkillTopicInput
            label="Mentorship Topics"
            newItem={newTopic}
            setNewItem={setNewTopic}
            handleAdd={handleAddTopic}
            items={user.mentorshipTopics}
            handleRemove={handleRemoveTopic}
          />
          <button
            type="button"
            className="w-full py-3 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 mt-4"
            onClick={nextStep}
          >
            Next
          </button>
          <button
            type="button"
            className="w-full py-3 px-4 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 mt-4"
            onClick={prevStep}
          >
            Back
          </button>
        </motion.div>
      )}

      {/* Step 5: Bio Section */}
      {step === 5 && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <InputField
            icon={faUser}
            type="text"
            name="bio"
            value={user.bio}
            onChange={handleInput}
            placeholder="Bio"
            required
          />
          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 mt-4"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <button
            type="button"
            className="w-full py-3 px-4 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 mt-4"
            onClick={prevStep}
          >
            Back
          </button>
        </motion.div>
      )}
    </form>
  );
};

const InputField = ({ icon, type, name, value, onChange, placeholder, required }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={icon} className="text-gray-500" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:outline-none focus:border-red-600"
        required={required}
      />
    </div>
  </div>
);

const SkillTopicInput = ({ label, newItem, setNewItem, handleAdd, items, handleRemove }) => (
  <div className="flex flex-col gap-6">
    <h3 className="font-bold text-lg">{label}</h3>
    <div className="flex items-center gap-4">
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        className="py-2 px-4 border-2 border-gray-300 rounded-2xl"
        placeholder={`Add a ${label.toLowerCase()}...`}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="py-2 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700"
      >
        Add
      </button>
    </div>
    <ul className="list-disc ml-6">
      {items.map((item, index) => (
        <li key={index} className="flex justify-between">
          {item}
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="text-red-600"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default MentorRegister;
