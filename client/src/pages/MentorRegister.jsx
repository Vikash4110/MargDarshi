// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../store/auth";
// import { toast } from "react-toastify";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faPhone,
//   faBuilding,
//   faEnvelope,
//   faListOl,
// } from "@fortawesome/free-solid-svg-icons";
// import { motion } from "framer-motion";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const MentorRegister = () => {
//   const navigate = useNavigate();
//   const { storeTokenInLS } = useAuth();

//   const [user, setUser] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//     jobTitle: "",
//     industry: "",
//     yearsOfExperience: "",
//     company: "",
//     linkedInUrl: "",
//     skills: [],
//     mentorshipTopics: [],
//     bio: "",
//   });

//   const [newSkill, setNewSkill] = useState("");
//   const [newTopic, setNewTopic] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState(1);
//   const [profilePicture, setProfilePicture] = useState(null);

//   const handleInput = (e) => {
//     const { name, value } = e.target;
//     setUser((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setProfilePicture(e.target.files[0]);
//   };

//   const handleAddSkill = () => {
//     const trimmedSkill = newSkill.trim();
//     if (trimmedSkill && !user.skills.includes(trimmedSkill)) {
//       setUser((prev) => ({
//         ...prev,
//         skills: [...prev.skills, trimmedSkill],
//       }));
//       setNewSkill("");
//     }
//   };

//   const handleAddTopic = () => {
//     const trimmedTopic = newTopic.trim();
//     if (trimmedTopic && !user.mentorshipTopics.includes(trimmedTopic)) {
//       setUser((prev) => ({
//         ...prev,
//         mentorshipTopics: [...prev.mentorshipTopics, trimmedTopic],
//       }));
//       setNewTopic("");
//     }
//   };

//   const handleRemoveSkill = (skill) => {
//     setUser((prev) => ({
//       ...prev,
//       skills: prev.skills.filter((s) => s !== skill),
//     }));
//   };

//   const handleRemoveTopic = (topic) => {
//     setUser((prev) => ({
//       ...prev,
//       mentorshipTopics: prev.mentorshipTopics.filter((t) => t !== topic),
//     }));
//   };
 
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!backendUrl) {
//       toast.error(
//         "Backend URL is not defined. Check your environment variables."
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("fullName", user.fullName);
//       formData.append("email", user.email);
//       formData.append("password", user.password);
//       formData.append("phoneNumber", user.phoneNumber);
//       formData.append("jobTitle", user.jobTitle);
//       formData.append("industry", user.industry);
//       formData.append("yearsOfExperience", user.yearsOfExperience);
//       formData.append("company", user.company);
//       formData.append("linkedInUrl", user.linkedInUrl);
//       formData.append("bio", user.bio);

//       // Append skills and mentorshipTopics as JSON strings
//       formData.append("skills", JSON.stringify(user.skills));
//       formData.append("mentorshipTopics", JSON.stringify(user.mentorshipTopics));

//       // Append profile picture only if it exists
//       if (profilePicture) {
//         formData.append("profilePicture", profilePicture);
//       }

//       const response = await fetch(`${backendUrl}/api/auth/mentor-register`, {
//         method: "POST",
//         body: formData, // FormData will automatically set the Content-Type to multipart/form-data
//       });

//       const resData = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           resData.extraDetails || resData.message || "Registration failed"
//         );
//       }

//       storeTokenInLS(resData.token);
//       toast.success("Registered Successfully");

//       // Reset form
//       setUser({
//         fullName: "",
//         email: "",
//         password: "",
//         phoneNumber: "",
//         jobTitle: "",
//         industry: "",
//         yearsOfExperience: "",
//         company: "",
//         linkedInUrl: "",
//         skills: [],
//         mentorshipTopics: [],
//         bio: "",
//       });

//       navigate("/mentor-show");
//     } catch (error) {
//       toast.error(error.message || "An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-4">
//       <h1 className="text-black text-5xl font-bold text-center mb-6">
//         Mentor Register
//       </h1>
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 lg:p-12"
//       >
//         {/* Progress Indicator */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center">
//             {[1, 2, 3, 4, 5].map((s) => (
//               <div
//                 key={s}
//                 className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                   step >= s
//                     ? "bg-red-600 text-white"
//                     : "bg-gray-200 text-gray-500"
//                 }`}
//               >
//                 {s}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Step 1: Personal Information */}
//         {step === 1 && (
//           <motion.div
//             initial={{ opacity: 0, x: -100 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="space-y-6"
//           >
//             <InputField
//               icon={faUser}
//               type="text"
//               name="fullName"
//               value={user.fullName}
//               onChange={handleInput}
//               placeholder="Full Name"
//               required
//             />

//             <InputField
//               icon={faEnvelope}
//               type="email"
//               name="email"
//               value={user.email}
//               onChange={handleInput}
//               placeholder="Email"
//               required
//             />

//             <InputField
//               icon={faUser}
//               type="password"
//               name="password"
//               value={user.password}
//               onChange={handleInput}
//               placeholder="Password"
//               required
//             />

//             <InputField
//               icon={faPhone}
//               type="text"
//               name="phoneNumber"
//               value={user.phoneNumber}
//               onChange={handleInput}
//               placeholder="Phone Number"
//               required
//             />

//             <div className="flex justify-between gap-4 mt-8">
//               <button
//                 type="button"
//                 onClick={() => navigate("/")}
//                 className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
//               >
//                 Back
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setStep(2)}
//                 className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all"
//               >
//                 Next
//               </button>
//             </div>
//           </motion.div>
//         )}

//         {/* Step 2: Job and Company Information */}
//         {step === 2 && (
//           <motion.div
//             initial={{ opacity: 0, x: -100 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="space-y-6"
//           >
//             <InputField
//               icon={faBuilding}
//               type="text"
//               name="jobTitle"
//               value={user.jobTitle}
//               onChange={handleInput}
//               placeholder="Job Title"
//               required
//             />

//             <InputField
//               icon={faBuilding}
//               type="text"
//               name="industry"
//               value={user.industry}
//               onChange={handleInput}
//               placeholder="Industry"
//               required
//             />

//             <InputField
//               icon={faListOl}
//               type="number"
//               name="yearsOfExperience"
//               value={user.yearsOfExperience}
//               onChange={handleInput}
//               placeholder="Years of Experience"
//               required
//             />

//             <InputField
//               icon={faBuilding}
//               type="text"
//               name="company"
//               value={user.company}
//               onChange={handleInput}
//               placeholder="Company"
//             />

//             <InputField
//               icon={faUser}
//               type="url"
//               name="linkedInUrl"
//               value={user.linkedInUrl}
//               onChange={handleInput}
//               placeholder="LinkedIn URL"
//             />

//             <div className="flex justify-between gap-4 mt-8">
//               <button
//                 type="button"
//                 onClick={() => setStep(1)}
//                 className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
//               >
//                 Back
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setStep(3)}
//                 className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all"
//               >
//                 Next
//               </button>
//             </div>
//           </motion.div>
//         )}

//         {/* Step 3: Skills */}
//         {step === 3 && (
//           <motion.div
//             initial={{ opacity: 0, x: -100 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="space-y-6"
//           >
//             <SkillTopicInput
//               label="Skills"
//               newItem={newSkill}
//               setNewItem={setNewSkill}
//               handleAdd={handleAddSkill}
//               items={user.skills}
//               handleRemove={handleRemoveSkill}
//             />

//             <div className="flex justify-between gap-4 mt-8">
//               <button
//                 type="button"
//                 onClick={() => setStep(2)}
//                 className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
//               >
//                 Back
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setStep(4)}
//                 className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all"
//               >
//                 Next
//               </button>
//             </div>
//           </motion.div>
//         )}

//         {/* Step 4: Mentorship Topics */}
//         {step === 4 && (
//           <motion.div
//             initial={{ opacity: 0, x: -100 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="space-y-6"
//           >
//             <SkillTopicInput
//               label="Mentorship Topics"
//               newItem={newTopic}
//               setNewItem={setNewTopic}
//               handleAdd={handleAddTopic}
//               items={user.mentorshipTopics}
//               handleRemove={handleRemoveTopic}
//             />

//             <div className="flex justify-between gap-4 mt-8">
//               <button
//                 type="button"
//                 onClick={() => setStep(3)}
//                 className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
//               >
//                 Back
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setStep(5)}
//                 className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all"
//               >
//                 Next
//               </button>
//             </div>
//           </motion.div>
//         )}

//         {/* Step 5: Bio Section */}
//         {step === 5 && (
//           <motion.div
//             initial={{ opacity: 0, x: -100 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="space-y-6"
//           >
//             <textarea
//               name="bio"
//               value={user.bio}
//               onChange={handleInput}
//               className="w-full rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-red-600"
//               placeholder="Write a brief bio"
//               rows={5}
//             />
//             <div className="flex items-center gap-4 bg-white border border-gray-300 rounded-2xl shadow-sm py-3 px-5 focus-within:ring-2 focus-within:ring-red-600">
//               <input
//                 type="file"
//                 name="profilePicture"
//                 onChange={handleFileChange}
//                 className="w-full focus:outline-none"
//                 required
//               />
//             </div>

//             <div className="flex justify-between gap-4 mt-8">
//               <button
//                 type="button"
//                 onClick={() => setStep(4)}
//                 className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
//               >
//                 Back
//               </button>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl ${
//                   loading
//                     ? "opacity-50 cursor-not-allowed"
//                     : "hover:from-red-700 hover:to-red-800"
//                 } transition-all`}
//               >
//                 {loading ? "Registering..." : "Register"}
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </form>
//     </div>
//   );
// };

// const InputField = ({ icon, ...props }) => (
//   <div className="flex items-center gap-4 bg-white border border-gray-300 rounded-2xl shadow-sm py-3 px-5 focus-within:ring-2 focus-within:ring-red-600">
//     <FontAwesomeIcon icon={icon} className="text-gray-500" />
//     <input {...props} className="w-full focus:outline-none" />
//   </div>
// );

// const SkillTopicInput = ({
//   label,
//   newItem,
//   setNewItem,
//   handleAdd,
//   items,
//   handleRemove,
// }) => (
//   <div className="flex flex-col gap-4">
//     <div className="flex gap-4 items-center">
//       <input
//         type="text"
//         value={newItem}
//         onChange={(e) => setNewItem(e.target.value)}
//         className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
//         placeholder={`Add ${label}`}
//       />

//       <button
//         type="button"
//         onClick={handleAdd}
//         className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
//       >
//         Add
//       </button>
//     </div>

//     <div className="flex flex-wrap gap-2 mt-4">
//       {items.map((item, idx) => (
//         <div
//           key={idx}
//           className="flex items-center bg-gray-200 py-1 px-3 rounded-full"
//         >
//           <span>{item}</span>

//           <button
//             type="button"
//             onClick={() => handleRemove(item)}
//             className="ml-2 text-red-600 hover:text-red-700"
//           >
//             x
//           </button>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// export default MentorRegister;
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
import { motion, AnimatePresence } from "framer-motion";
import RegisterImg from "../assets/vecteezy_white-clipboard-task-management-todo-check-list-efficient_9315274.png";

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
  });
  const [newSkill, setNewSkill] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState(null);

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
      formData.append("jobTitle", user.jobTitle);
      formData.append("industry", user.industry);
      formData.append("yearsOfExperience", user.yearsOfExperience);
      formData.append("company", user.company);
      formData.append("linkedInUrl", user.linkedInUrl);
      formData.append("skills", JSON.stringify(user.skills));
      formData.append("mentorshipTopics", JSON.stringify(user.mentorshipTopics));
      formData.append("bio", user.bio);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const response = await fetch(`${backendUrl}/api/auth/mentor-register`, {
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

  // Background animation variants
  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  // Step animation variants
  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 flex items-center justify-center p-4 lg:p-8 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      {/* Container for Form and Image */}
      <motion.div
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl flex flex-col lg:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <motion.h1
            className="text-4xl font-bold text-[#0f6f5c] text-center mb-6 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Mentor Register
          </motion.h1>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Progress Indicator */}
            <motion.div
              className="mb-8 flex justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <motion.div
                  key={s}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= s ? "bg-[#0f6f5c] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {s}
                </motion.div>
              ))}
            </motion.div>

            {/* Steps */}
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
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
                    <motion.button
                      type="button"
                      onClick={() => navigate("/")}
                      className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-2xl hover:bg-[#0e5f4c] transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Job and Company Information */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
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
                    <motion.button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-2xl hover:bg-[#0e5f4c] transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Skills */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
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
                    <motion.button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setStep(4)}
                      className="w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-2xl hover:bg-[#0e5f4c] transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Mentorship Topics */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
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
                    <motion.button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setStep(5)}
                      className="w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-2xl hover:bg-[#0e5f4c] transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Bio Section */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <textarea
                    name="bio"
                    value={user.bio}
                    onChange={handleInput}
                    className="w-full rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-[#0f6f5c]"
                    placeholder="Write a brief bio"
                    rows={5}
                  />

                  <div className="flex items-center gap-4 bg-white border border-gray-300 rounded-2xl shadow-sm py-3 px-5 focus-within:ring-2 focus-within:ring-[#0f6f5c]">
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
                      id="file-upload"
                      required
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-[#0f6f5c] text-white py-2 px-4 rounded-lg hover:bg-[#0e5f4f] transition-all"
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
                      onClick={() => setStep(4)}
                      className="w-full py-3 px-4 bg-gray-400 text-white rounded-2xl hover:bg-gray-500 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-4 bg-[#0f6f5c] text-white rounded-2xl ${
                        loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0e5f4c]"
                      } transition-all`}
                      whileHover={{ scale: loading ? 1 : 1.05 }}
                      whileTap={{ scale: loading ? 1 : 0.95 }}
                    >
                      {loading ? "Registering..." : "Register"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Right Section - Image */}
        <motion.div
          className="hidden lg:flex w-1/2 justify-center items-center bg-[#0f6f5c] rounded-r-3xl"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img src={RegisterImg} alt="Mentor Register" className="w-3/4 h-auto object-contain" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const InputField = ({ icon, ...props }) => (
  <div className="flex items-center gap-4 bg-white border border-gray-300 rounded-2xl shadow-sm py-3 px-5 focus-within:ring-2 focus-within:ring-[#0f6f5c]">
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
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f6f5c]"
        placeholder={`Add ${label}`}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="px-6 py-2 bg-[#0f6f5c] text-white rounded-lg hover:bg-[#0e5f4c] transition-all"
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
            className="ml-2 text-[#0f6f5c] hover:text-[#0e5f4c]"
          >
            x
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default MentorRegister;