import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faBuilding, faEnvelope, faUpload } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import RegisterImg from "../assets/vecteezy_white-clipboard-task-management-todo-check-list-efficient_9315274.png";

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
        profilePicture: null,
    });

    const [newSkill, setNewSkill] = useState("");
    const [newTopic, setNewTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const { storeTokenInLS } = useAuth();
    const [step, setStep] = useState(1);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setUser((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
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
            const formData = new FormData();
            formData.append("fullName", user.fullName);
            formData.append("email", user.email);
            formData.append("password", user.password);
            formData.append("phoneNumber", user.phoneNumber);
            formData.append("currentEducationLevel", user.currentEducationLevel);
            formData.append("universityName", user.universityName);
            formData.append("fieldOfStudy", user.fieldOfStudy);
            formData.append("expectedGraduationYear", user.expectedGraduationYear);
            formData.append("careerInterests", JSON.stringify(user.careerInterests));
            formData.append("desiredIndustry", JSON.stringify(user.desiredIndustry));
            formData.append("skillsToDevelop", JSON.stringify(user.skillsToDevelop));
            formData.append("typeOfMentorshipSought", JSON.stringify(user.typeOfMentorshipSought));
            formData.append("preferredDaysAndTimes", JSON.stringify(user.preferredDaysAndTimes));
            formData.append("preferredMentorshipMode", user.preferredMentorshipMode);
            formData.append("personalIntroduction", user.personalIntroduction);
            formData.append("linkedInProfileUrl", user.linkedInProfileUrl);
            if (user.profilePicture) {
                formData.append("profilePicture", user.profilePicture);
            }

            const response = await fetch(`${backendUrl}/api/auth/mentee-register`, {
                method: "POST",
                body: formData,
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
                profilePicture: null,
            });

            navigate("/mentors");
        } catch (error) {
            toast.error(error.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-4">
            <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Side: Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-12">
                    <h1 className="text-black text-5xl font-bold text-center mb-6">Mentee Register</h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Progress Indicator */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <div
                                        key={s}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            step >= s ? "bg-[#0f6f5c] text-white" : "bg-gray-200 text-gray-500"
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
                                <InputField icon={faUser} type="text" name="fullName" value={user.fullName} onChange={handleInput} placeholder="Full Name" required />
                                <InputField icon={faEnvelope} type="email" name="email" value={user.email} onChange={handleInput} placeholder="Email" required />
                                <InputField icon={faUser} type="password" name="password" value={user.password} onChange={handleInput} placeholder="Password" required />
                                <InputField icon={faPhone} type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleInput} placeholder="Phone Number" required />
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
                                        className="w-full py-3 px-4 bg-gradient-to-r from-[#0f6f5c] to-[#0f6f5c] text-white rounded-2xl hover:from-[#0e5f4c] hover:to-[#0e5f4c] transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Education and LinkedIn */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <InputField icon={faBuilding} type="text" name="currentEducationLevel" value={user.currentEducationLevel} onChange={handleInput} placeholder="Education Level" required />
                                <InputField icon={faBuilding} type="text" name="fieldOfStudy" value={user.fieldOfStudy} onChange={handleInput} placeholder="Field of Study" required />
                                <InputField icon={faUser} type="number" name="expectedGraduationYear" value={user.expectedGraduationYear} onChange={handleInput} placeholder="Expected Graduation Year" required />
                                <InputField icon={faUser} type="url" name="linkedInProfileUrl" value={user.linkedInProfileUrl} onChange={handleInput} placeholder="LinkedIn Profile URL" />
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
                                        className="w-full py-3 px-4 bg-gradient-to-r from-[#0f6f5c] to-[#0f6f5c] text-white rounded-2xl hover:from-[#0e5f4c] hover:to-[#0e5f4c] transition-all"
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
                                <SkillTopicInput label="Skills to Develop" newItem={newSkill} setNewItem={setNewSkill} handleAdd={handleAddSkill} items={user.skillsToDevelop} handleRemove={handleRemoveSkill} />
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
                                        className="w-full py-3 px-4 bg-gradient-to-r from-[#0f6f5c] to-[#0f6f5c] text-white rounded-2xl hover:from-[#0e5f4c] hover:to-[#0e5f4c] transition-all"
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
                                <SkillTopicInput label="Mentorship Topics" newItem={newTopic} setNewItem={setNewTopic} handleAdd={handleAddTopic} items={user.typeOfMentorshipSought} handleRemove={handleRemoveTopic} />
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
                                        className="w-full py-3 px-4 bg-gradient-to-r from-[#0f6f5c] to-[#0f6f5c] text-white rounded-2xl hover:from-[#0e5f4c] hover:to-[#0e5f4c] transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Personal Introduction */}
                        {step === 5 && (
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <textarea
                                    name="personalIntroduction"
                                    value={user.personalIntroduction}
                                    onChange={handleInput}
                                    className="w-full rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-[#0f6f5c]"
                                    placeholder="Write a brief personal introduction"
                                    rows={5}
                                />
                                <div className="flex items-center gap-4 bg-white border border-gray-300 rounded-2xl shadow-sm py-3 px-5 focus-within:ring-2 focus-within:ring-[#0f6f5c]">
  <label className="flex items-center gap-2 bg-[#0f6f5c] text-white py-2 px-4 rounded-lg hover:bg-[#0e5f4f] cursor-pointer">
    <FontAwesomeIcon icon={faUpload} className="text-white" />
    <span className="text-white">Upload Profile Picture</span>
    <input
      type="file"
      name="profilePicture"
      onChange={(e) => {
        handleFileChange(e);
        // Show the file name and checkmark
        const fileName = e.target.files[0]?.name;
        if (fileName) {
          const fileDisplay = document.getElementById("file-display");
          fileDisplay.textContent = fileName;
          fileDisplay.classList.remove("hidden");
        }
      }}
      className="hidden"
      required
    />
  </label>
  <div id="file-display" className="hidden flex items-center gap-2 text-[#0f6f5c]">
    <span>✔</span>
    <span className="text-sm"></span>
  </div>
</div>
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
                                        className={`w-full py-3 px-4 bg-gradient-to-r from-[#0f6f5c] to-[#0f6f5c] text-white rounded-2xl ${
                                            loading ? "opacity-50 cursor-not-allowed" : "hover:from-[#0e5f4c] hover:to-[#0e5f4c]"
                                        } transition-all`}
                                    >
                                        {loading ? "Registering..." : "Register"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>

                {/* Right Side: Image */}
                <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center bg-gradient-to-r from-[#0f6f5c] to-[#0e5f4c]">
                    <img src={RegisterImg} alt="Register" className="w-3/4 h-auto" />
                </div>
            </div>
        </div>
    );
};

const InputField = ({ icon, ...props }) => (
    <div className="flex items-center gap-4 bg-white border border-gray-300 rounded-2xl shadow-sm py-3 px-5 focus-within:ring-2 focus-within:ring-[#0f6f5c]">
        <FontAwesomeIcon icon={icon} className="text-gray-500" />
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
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f6f5c]"
                placeholder={`Add ${label}`}
            />
            <button
                type="button"
                onClick={handleAdd}
                className="px-6 py-2 bg-gradient-to-r from-[#0f6f5c] to-[#0f6f5c] text-white rounded-lg hover:from-[#0e5f4c] hover:to-[#0e5f4c] transition-all"
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
                        className="ml-2 text-[#0f6f5c] hover:text-[#0e5f4c]"
                    >
                        x
                    </button>
                </div>
            ))}
        </div>
    </div>
);

export default MenteeRegister;