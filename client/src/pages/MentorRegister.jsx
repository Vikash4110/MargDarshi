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
import { Link } from "react-router-dom";

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
  const { storeTokenInLS } = useAuth();

  // Input handler
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

  // Remove skill from skills array
  const handleRemoveSkill = (skill) => {
    setUser((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // Remove topic from mentorship topics array
  const handleRemoveTopic = (topic) => {
    setUser((prev) => ({
      ...prev,
      mentorshipTopics: prev.mentorshipTopics.filter((t) => t !== topic),
    }));
  };

// Form submission handler
const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!backendUrl) {
      toast.error("Backend URL is not defined. Please check your environment variables.");
      return;
    }
  
    setLoading(true);
  
    try {
      // Ensure yearsOfExperience is a number
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
      navigate("/");
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <InputField
          icon={faUser}
          type="text"
          name="fullName"
          value={user.fullName}
          onChange={handleInput}
          placeholder="Full Name"
          required
        />
        
        {/* Email */}
        <InputField
          icon={faEnvelope}
          type="email"
          name="email"
          value={user.email}
          onChange={handleInput}
          placeholder="Email"
          required
        />
        
        {/* Password */}
        <InputField
          icon={faUser}
          type="password"
          name="password"
          value={user.password}
          onChange={handleInput}
          placeholder="Password"
          required
        />

        {/* Phone Number */}
        <InputField
          icon={faPhone}
          type="text"
          name="phoneNumber"
          value={user.phoneNumber}
          onChange={handleInput}
          placeholder="Phone Number"
          required
        />

        {/* Job Title */}
        <InputField
          icon={faBuilding}
          type="text"
          name="jobTitle"
          value={user.jobTitle}
          onChange={handleInput}
          placeholder="Job Title"
          required
        />

        {/* Industry */}
        <InputField
          icon={faBuilding}
          type="text"
          name="industry"
          value={user.industry}
          onChange={handleInput}
          placeholder="Industry"
          required
        />

        {/* Years of Experience */}
        <InputField
          icon={faListOl}
          type="number"
          name="yearsOfExperience"
          value={user.yearsOfExperience}
          onChange={handleInput}
          placeholder="Years of Experience"
          required
        />

        {/* Company */}
        <InputField
          icon={faBuilding}
          type="text"
          name="company"
          value={user.company}
          onChange={handleInput}
          placeholder="Company"
        />

        {/* LinkedIn URL */}
        <InputField
          icon={faUser}
          type="url"
          name="linkedInUrl"
          value={user.linkedInUrl}
          onChange={handleInput}
          placeholder="LinkedIn URL"
        />
      </div>

      {/* Skills Section */}
      <SkillTopicInput
        label="Skills"
        newItem={newSkill}
        setNewItem={setNewSkill}
        handleAdd={handleAddSkill}
        items={user.skills}
        handleRemove={handleRemoveSkill}
      />

      {/* Mentorship Topics Section */}
      <SkillTopicInput
        label="Mentorship Topics"
        newItem={newTopic}
        setNewItem={setNewTopic}
        handleAdd={handleAddTopic}
        items={user.mentorshipTopics}
        handleRemove={handleRemoveTopic}
      />

      {/* Bio Section */}
      <textarea
        name="bio"
        value={user.bio}
        onChange={handleInput}
        className="shadow-xl w-full rounded-xl border border-gray-300 bg-transparent px-3 py-3 text-sm text-gray-700 outline-none transition-all focus:border-2 focus:border-red-600"
        placeholder="Short Bio"
      />

      <button
        type="submit"
        className="w-full py-3 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <p className="text-center mt-4 text-gray-600">
          Already registered? <Link to="/mentor-login" className="text-[#ed1f26] font-semibold hover:underline">Login</Link>
        </p>
    </form>
  );
};
// Input Field Component
const InputField = ({ icon, type, name, value, onChange, placeholder, required = false }) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="shadow-xl peer h-full w-full rounded-xl border border-gray-300 bg-transparent px-3 py-3 text-sm text-gray-700 outline-none transition-all focus:border-2 focus:border-red-600"
      required={required}
    />
    <label className="absolute left-3 top-0.5 text-sm text-gray-800 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-600 peer-focus:-top-2.5 peer-focus:text-red-600">
      <FontAwesomeIcon icon={icon} /> {placeholder}
    </label>
  </div>
);

// Skill and Topic Input Component
const SkillTopicInput = ({ label, newItem, setNewItem, handleAdd, items, handleRemove }) => (
  <div className="flex flex-col gap-4 mt-4">
    <div className="relative">
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        className="shadow-xl peer h-full w-full rounded-xl border border-gray-300 bg-transparent px-3 py-3 text-sm text-gray-700 outline-none transition-all focus:border-2 focus:border-red-600"
        placeholder={`Add a ${label.toLowerCase()}`}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 w-full py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Add {label}
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={index}
          className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-800"
        >
          {item}
          <button
            type="button"
            className="ml-2 text-red-600"
            onClick={() => handleRemove(item)}
          >
            x
          </button>
        </span>
      ))}
    </div>
  </div>


);

export default MentorRegister;
