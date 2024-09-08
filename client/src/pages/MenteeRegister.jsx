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
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MenteeRegister = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    currentEducationLevel: "",
    universityName: "",
    fieldOfStudy: "",
    careerInterests: "",
    desiredIndustry: "",
    skillsToDevelop: [], // Initialize as array
    mentorshipTopics: [], // Initialize as array
    linkedInProfileUrl: "",
    bio: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const { storeTokenInLS } = useAuth();

  // Handle input change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Add new skill to array
  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !user.skillsToDevelop.includes(trimmedSkill)) {
      setUser((prev) => ({
        ...prev,
        skillsToDevelop: [...prev.skillsToDevelop, trimmedSkill],
      }));
      setNewSkill("");
    }
  };

  // Add new mentorship topic to array
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

  // Remove skill from array
  const handleRemoveSkill = (skill) => {
    setUser((prev) => ({
      ...prev,
      skillsToDevelop: prev.skillsToDevelop.filter((s) => s !== skill),
    }));
  };

  // Remove mentorship topic from array
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
      // Validate that skills and topics are arrays
      if (!Array.isArray(user.skillsToDevelop) || !Array.isArray(user.mentorshipTopics)) {
        throw new Error("Skills and topics must be arrays");
      }

      const response = await fetch(`${backendUrl}/api/auth/mentee-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.extraDetails || resData.message || "Registration failed");
      }

      storeTokenInLS(resData.token);
      toast.success("Registered Successfully");

      // Reset form after successful registration
      setUser({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        currentEducationLevel: "",
        universityName: "",
        fieldOfStudy: "",
        careerInterests: "",
        desiredIndustry: "",
        skillsToDevelop: [],
        mentorshipTopics: [],
        linkedInProfileUrl: "",
        bio: "",
      });

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

        {/* Education Level */}
        <InputField
          icon={faBuilding}
          type="text"
          name="currentEducationLevel"
          value={user.currentEducationLevel}
          onChange={handleInput}
          placeholder="Current Education Level"
          required
        />

        {/* Field of Study */}
        <InputField
          icon={faBuilding}
          type="text"
          name="fieldOfStudy"
          value={user.fieldOfStudy}
          onChange={handleInput}
          placeholder="Field of Study"
          required
        />

        {/* LinkedIn Profile */}
        <InputField
          icon={faUser}
          type="url"
          name="linkedInProfileUrl"
          value={user.linkedInProfileUrl}
          onChange={handleInput}
          placeholder="LinkedIn Profile URL"
        />
      </div>

      {/* Skills Section */}
      <SkillTopicInput
        label="Skills"
        newItem={newSkill}
        setNewItem={setNewSkill}
        handleAdd={handleAddSkill}
        items={user.skillsToDevelop}
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
        Already registered?{" "}
        <Link to="/mentee-login" className="text-red-600 font-semibold hover:underline">
          Login
        </Link>
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
  <div className="relative w-full">
    <label className="block mb-2 text-gray-800">{label}</label>
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="shadow-xl peer h-full w-full rounded-xl border border-gray-300 bg-transparent px-3 py-3 text-sm text-gray-700 outline-none transition-all focus:border-2 focus:border-red-600"
          placeholder={`Add new ${label}`}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
        >
          Add
        </button>
      </div>
      <ul className="list-disc pl-5">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{item}</span>
            <button
              type="button"
              onClick={() => handleRemove(item)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default MenteeRegister;
