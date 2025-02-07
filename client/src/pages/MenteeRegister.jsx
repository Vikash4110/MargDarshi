import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faBuilding, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

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

  const [newSkill, setNewSkill] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const { storeTokenInLS } = useAuth();
  const [step, setStep] = useState(1); // Step tracking

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleAddTopic = () => {
    const trimmedTopic = newTopic.trim();
    if (trimmedTopic && !user.typeOfMentorshipSought.includes(trimmedTopic)) {
      setUser((prev) => ({
        ...prev,
        typeOfMentorshipSought: [...prev.typeOfMentorshipSought, trimmedTopic],
      }));
      setNewTopic("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setUser((prev) => ({
      ...prev,
      skillsToDevelop: prev.skillsToDevelop.filter((s) => s !== skill),
    }));
  };

  const handleRemoveTopic = (topic) => {
    setUser((prev) => ({
      ...prev,
      typeOfMentorshipSought: prev.typeOfMentorshipSought.filter((t) => t !== topic),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!backendUrl) {
      toast.error("Backend URL is not defined. Please check your environment variables.");
      return;
    }

    setLoading(true);

    try {
      const formData = {
        ...user,
        skillsToDevelop: user.skillsToDevelop.length ? user.skillsToDevelop : [],
        typeOfMentorshipSought: user.typeOfMentorshipSought.length ? user.typeOfMentorshipSought : [],
        preferredDaysAndTimes: user.preferredDaysAndTimes.length ? user.preferredDaysAndTimes : [],
        careerInterests: user.careerInterests.length ? user.careerInterests : [],
        desiredIndustry: user.desiredIndustry.length ? user.desiredIndustry : [],
        expectedGraduationYear: Number(user.expectedGraduationYear),
      };

      const response = await fetch(`${backendUrl}/api/auth/mentee-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.extraDetails || resData.message || "Registration failed");
      }

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

      navigate("/mentee-user");
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full max-w-lg mx-auto mt-6 text-center border-2 rounded-3xl py-10 lg:py-12 px-6 lg:px-10 shadow-2xl"
    >
      {/* Step 1: Personal Information */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <InputField icon={faUser} type="text" name="fullName" value={user.fullName} onChange={handleInput} placeholder="Full Name" required />
          <InputField icon={faEnvelope} type="email" name="email" value={user.email} onChange={handleInput} placeholder="Email" required />
          <InputField icon={faUser} type="password" name="password" value={user.password} onChange={handleInput} placeholder="Password" required />
          <InputField icon={faPhone} type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleInput} placeholder="Phone Number" required />
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Education and LinkedIn */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <InputField icon={faBuilding} type="text" name="currentEducationLevel" value={user.currentEducationLevel} onChange={handleInput} placeholder="Education Level" required />
          <InputField icon={faBuilding} type="text" name="fieldOfStudy" value={user.fieldOfStudy} onChange={handleInput} placeholder="Field of Study" required />
          <InputField icon={faUser} type="number" name="expectedGraduationYear" value={user.expectedGraduationYear} onChange={handleInput} placeholder="Expected Graduation Year" required />
          <InputField icon={faUser} type="url" name="linkedInProfileUrl" value={user.linkedInProfileUrl} onChange={handleInput} placeholder="LinkedIn Profile URL" />
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Skills */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <SkillTopicInput label="Skills to Develop" newItem={newSkill} setNewItem={setNewSkill} handleAdd={handleAddSkill} items={user.skillsToDevelop} handleRemove={handleRemoveSkill} />
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Mentorship Topics */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <SkillTopicInput label="Mentorship Topics" newItem={newTopic} setNewItem={setNewTopic} handleAdd={handleAddTopic} items={user.typeOfMentorshipSought} handleRemove={handleRemoveTopic} />
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 5: Personal Introduction */}
      {step === 5 && (
        <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <textarea
            name="personalIntroduction"
            value={user.personalIntroduction}
            onChange={handleInput}
            className="shadow-xl w-full rounded-xl border border-gray-300 p-4"
            placeholder="Write a brief personal introduction"
            rows={5}
          />
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-red-600 text-white rounded-2xl ${loading ? "cursor-not-allowed" : "hover:bg-red-700"}`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </motion.div>
      )}
    </form>
  );
};

const InputField = ({ icon, ...props }) => (
  <div className="flex items-center gap-4 bg-white border border-gray-300 rounded-2xl shadow-xl py-3 px-5">
    <FontAwesomeIcon icon={icon} />
    <input {...props} className="w-full focus:outline-none" />
  </div>
);

const SkillTopicInput = ({ label, newItem, setNewItem, handleAdd, items, handleRemove }) => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-4 items-center">
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
        placeholder={`Add ${label}`}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Add
      </button>
    </div>
    <div className="flex flex-wrap gap-2 mt-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center bg-gray-200 py-1 px-3 rounded-full">
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

export default MenteeRegister;
