// import React, { useState, useEffect } from "react";
// import { useAuth } from "../store/auth";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   IoPerson,
//   IoMail,
//   IoCall,
//   IoSchool,
//   IoBriefcase,
//   IoCompass,
//   IoCode,
//   IoChatbox,
//   IoTime,
// } from "react-icons/io5"; // Updated to remove IoLink
// import { FaLinkedin } from "react-icons/fa"; // Added FaLinkedin for LinkedIn link

// const MenteeProfile = () => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const { authorizationToken } = useAuth();
//   const navigate = useNavigate();

//   const [mentee, setMentee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMenteeDetails = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/api/auth/mentee-user`, {
//           method: "GET",
//           headers: {
//             Authorization: authorizationToken,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch mentee details");
//         }

//         const data = await response.json();
//         setMentee(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message || "Error fetching mentee details");
//         setLoading(false);
//       }
//     };

//     fetchMenteeDetails();
//   }, [authorizationToken]);

//   if (loading) {
//     return (
//       <motion.p
//         className="text-center text-lg font-semibold text-gray-700"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         Loading...
//       </motion.p>
//     );
//   }

//   if (error) {
//     return (
//       <motion.p
//         className="text-red-500 text-center text-lg font-semibold"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         {error}
//       </motion.p>
//     );
//   }

//   // Background animation variants
//   const bgVariants = {
//     animate: {
//       backgroundPosition: ["0% 0%", "100% 100%"],
//       transition: {
//         duration: 20,
//         ease: "linear",
//         repeat: Infinity,
//         repeatType: "reverse",
//       },
//     },
//   };

//   // Section animation variants
//   const sectionVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
//   };

//   return (
//     <motion.div
//       className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 p-4 lg:p-8 overflow-hidden"
//       variants={bgVariants}
//       animate="animate"
//       style={{ backgroundSize: "200% 200%" }}
//     >
//       <motion.div
//         className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100 relative"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//       >
//         <motion.h2
//           className="text-3xl font-extrabold text-[#0f6f5c] text-center mb-8 tracking-tight"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           Mentee Profile
//         </motion.h2>

//         {/* Edit Button (Inside the box, top-right) */}
//         <motion.div
//           className="absolute top-8 right-8"
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2, duration: 0.5 }}
//         >
//           <Link
//             to="/mentee-update"
//             className="bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white font-semibold px-4 py-2 rounded-xl hover:from-teal-600 hover:to-teal-700 transition duration-300 shadow-md"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Edit Profile
//           </Link>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//           {/* Left Column - Profile Image */}
//           <motion.div
//             className="col-span-1 flex flex-col items-center md:items-start"
//             variants={sectionVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             {mentee.profilePicture && (
//               <motion.img
//                 src={mentee.profilePicture}
//                 alt="Profile"
//                 className="w-48 h-48 rounded-full border-4 border-teal-500 mb-6 shadow-lg object-cover"
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.5 }}
//                 whileHover={{ scale: 1.05 }}
//               />
//             )}
//           </motion.div>

//           {/* Right Column - Information */}
//           <motion.div
//             className="col-span-2"
//             variants={sectionVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             {/* Basic Info */}
//             <motion.div
//               className="mb-8"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//             >
//               <motion.h3
//                 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.3, duration: 0.5 }}
//               >
//                 <IoPerson className="mr-2 text-teal-600" /> {mentee.fullName}
//               </motion.h3>
//               <motion.p
//                 className="text-gray-500 text-sm mb-2 flex items-center"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4, duration: 0.5 }}
//               >
//                 <IoMail className="mr-2 text-teal-600" /> {mentee.email}
//               </motion.p>
//               <motion.p
//                 className="text-gray-600 text-sm flex items-center"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5, duration: 0.5 }}
//               >
//                 <IoCall className="mr-2 text-teal-600" /> {mentee.phoneNumber}
//               </motion.p>
//             </motion.div>

//             {/* Education Details */}
//             <motion.div
//               className="mb-6 bg-gray-50 p-6 rounded-xl shadow-sm"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6, duration: 0.5 }}
//             >
//               <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
//                 <IoSchool className="mr-2 text-teal-600" /> Education
//               </h4>
//               <p className="text-gray-700">
//                 <strong className="text-gray-800">University:</strong> {mentee.universityName || "Not specified"}
//               </p>
//               <p className="text-gray-700 mt-2">
//                 <strong className="text-gray-800">Field of Study:</strong> {mentee.fieldOfStudy || "Not specified"}
//               </p>
//               <p className="text-gray-700 mt-2">
//                 <strong className="text-gray-800">Graduation Year:</strong> {mentee.expectedGraduationYear || "Not specified"}
//               </p>
//             </motion.div>

//             {/* Career Interests */}
//             <motion.div
//               className="mb-6 bg-gray-50 p-6 rounded-xl shadow-sm"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.7, duration: 0.5 }}
//             >
//               <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
//                 <IoBriefcase className="mr-2 text-teal-600" /> Career Interests
//               </h4>
//               <p className="text-gray-700">
//                 {mentee.careerInterests?.join(", ") || "Not specified"}
//               </p>
//             </motion.div>

//             {/* Desired Industry */}
//             <motion.div
//               className="mb-6 bg-gray-50 p-6 rounded-xl shadow-sm"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.8, duration: 0.5 }}
//             >
//               <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
//                 <IoCompass className="mr-2 text-teal-600" /> Desired Industry
//               </h4>
//               <p className="text-gray-700">
//                 {mentee.desiredIndustry?.join(", ") || "Not specified"}
//               </p>
//             </motion.div>

//             {/* Skills to Develop */}
//             <motion.div
//               className="mb-6 bg-gray-50 p-6 rounded-xl shadow-sm"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.9, duration: 0.5 }}
//             >
//               <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
//                 <IoCode className="mr-2 text-teal-600" /> Skills to Develop
//               </h4>
//               <p className="text-gray-700">
//                 {mentee.skillsToDevelop?.join(", ") || "Not specified"}
//               </p>
//             </motion.div>

//             {/* Mentorship Preferences */}
//             <motion.div
//               className="mb-6 bg-gray-50 p-6 rounded-xl shadow-sm"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1.0, duration: 0.5 }}
//             >
//               <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
//                 <IoChatbox className="mr-2 text-teal-600" /> Mentorship Preferences
//               </h4>
//               <p className="text-gray-700">
//                 <strong className="text-gray-800">Type:</strong> {mentee.typeOfMentorshipSought?.join(", ") || "Not specified"}
//               </p>
//               <p className="text-gray-700 mt-2">
//                 <strong className="text-gray-800">Preferred Mode:</strong> {mentee.preferredMentorshipMode || "Not specified"}
//               </p>
//               <p className="text-gray-700 mt-2">
//                 <strong className="text-gray-800">Preferred Days & Times:</strong> {mentee.preferredDaysAndTimes?.join(", ") || "Not specified"}
//               </p>
//             </motion.div>

           
//             {/* Personal Introduction */}
//             <motion.div
//               className="mt-6 bg-gray-100 p-6 rounded-xl shadow-sm"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1.2, duration: 0.5 }}
//             >
//               <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
//                 <IoChatbox className="mr-2 text-teal-600" /> Personal Introduction
//               </h4>
//               <p className="text-gray-600">
//                 {mentee.personalIntroduction || "Not provided"}
//               </p>
//             </motion.div>

//  {/* Personal Introduction */}
//  <motion.div
//               className="mt-6 bg-gray-100 p-6 rounded-xl shadow-sm"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1.2, duration: 0.5 }}
//             >
//               <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
//                 <IoChatbox className="mr-2 text-teal-600" /> Social Links
//               </h4>
//               <motion.a
//                   href={mentee.linkedInProfileUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:underline font-semibold flex items-center"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <FaLinkedin className="mr-2 text-blue-600 text-2xl hover:text-blue-800 transition duration-200" />
//                 </motion.a>
//             </motion.div>
           

//           </motion.div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default MenteeProfile;

import React, { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoPerson,
  IoMail,
  IoCall,
  IoSchool,
  IoBriefcase,
  IoCompass,
  IoCode,
  IoChatbox,
  IoTime,
  IoDocumentText,
  IoStatsChart,
  IoCalendar,
  IoRibbon,
  IoGlobe,
  IoConstruct
} from "react-icons/io5";
import { FaLinkedin, FaGithub, FaTwitter, FaGlobe } from "react-icons/fa";
import ProgressBar from "../Components/ProgressBar";

const MenteeProfile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();

  const [mentee, setMentee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchMenteeDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/auth/mentee-user`, {
          method: "GET",
          headers: {
            Authorization: authorizationToken,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch mentee details");
        }

        const data = await response.json();
        setMentee(data);
        setFormData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching mentee details");
        setLoading(false);
      }
    };

    fetchMenteeDetails();
  }, [authorizationToken]);

  // Mock skill data
  const skills = [
    { name: "JavaScript", level: 75 },
    { name: "React", level: 65 },
    { name: "Node.js", level: 50 },
    { name: "UI/UX Design", level: 40 },
  ];

  // Mock activity data
  const activities = [
    { type: "Meeting", title: "Career Guidance Session", date: "2023-06-15", mentor: "Sarah Johnson" },
    { type: "Resource", title: "React Best Practices", date: "2023-06-10" },
    { type: "Goal", title: "Complete Portfolio Project", date: "2023-06-05", completed: true },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <IoStatsChart className="mr-2 text-teal-600" /> Progress Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Mentorship Completion</span>
                    <span className="text-sm font-medium text-gray-500">65%</span>
                  </div>
                  <ProgressBar progress={65} color="teal" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Skill Development</span>
                    <span className="text-sm font-medium text-gray-500">42%</span>
                  </div>
                  <ProgressBar progress={42} color="blue" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Career Readiness</span>
                    <span className="text-sm font-medium text-gray-500">58%</span>
                  </div>
                  <ProgressBar progress={58} color="purple" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <IoCalendar className="mr-2 text-teal-600" /> Upcoming Events
              </h3>
              <div className="space-y-3">
                <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-teal-100 p-2 rounded-lg text-teal-600 mr-3">
                    <IoChatbox />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Mentorship Session</h4>
                    <p className="text-sm text-gray-600">With Sarah Johnson</p>
                    <p className="text-xs text-gray-400 mt-1">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-3">
                    <IoSchool />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Webinar: Career Growth</h4>
                    <p className="text-sm text-gray-600">Hosted by Tech Professionals</p>
                    <p className="text-xs text-gray-400 mt-1">June 20, 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <IoRibbon className="mr-2 text-teal-600" /> Recent Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-teal-50 border border-teal-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-teal-800">Completed Course</h4>
                  <p className="text-sm text-gray-600 mt-1">React Fundamentals</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Skill Milestone</h4>
                  <p className="text-sm text-gray-600 mt-1">JavaScript Intermediate</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Networking</h4>
                  <p className="text-sm text-gray-600 mt-1">5 New Connections</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "details":
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <IoPerson className="mr-2 text-teal-600" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-600">{mentee.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-600">{mentee.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-600">{mentee.phoneNumber || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-gray-600">{mentee.location || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <IoSchool className="mr-2 text-teal-600" /> Education
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                  <p className="text-gray-600">{mentee.universityName || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                  <p className="text-gray-600">{mentee.fieldOfStudy || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <p className="text-gray-600">{mentee.expectedGraduationYear || "Not specified"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <IoBriefcase className="mr-2 text-teal-600" /> Career Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Career Interests</label>
                  <p className="text-gray-600">{mentee.careerInterests?.join(", ") || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desired Industry</label>
                  <p className="text-gray-600">{mentee.desiredIndustry?.join(", ") || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "skills":
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <IoCode className="mr-2 text-teal-600" /> Skills Assessment
              </h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm font-medium text-gray-500">{skill.level}%</span>
                    </div>
                    <ProgressBar progress={skill.level} color="teal" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <IoConstruct className="mr-2 text-teal-600" /> Skills to Develop
              </h3>
              <div className="flex flex-wrap gap-2">
                {mentee.skillsToDevelop?.map((skill, index) => (
                  <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
                {!mentee.skillsToDevelop?.length && (
                  <p className="text-gray-500">No skills specified</p>
                )}
              </div>
            </div>
          </div>
        );
      case "activity":
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <IoTime className="mr-2 text-teal-600" /> Recent Activity
              </h3>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                    <div className={`p-3 rounded-lg mr-4 ${
                      activity.type === "Meeting" ? "bg-teal-100 text-teal-600" :
                      activity.type === "Resource" ? "bg-blue-100 text-blue-600" :
                      "bg-purple-100 text-purple-600"
                    }`}>
                      {activity.type === "Meeting" ? <IoChatbox /> :
                       activity.type === "Resource" ? <IoDocumentText /> :
                       <IoRibbon />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{activity.title}</h4>
                      {activity.mentor && (
                        <p className="text-sm text-gray-600">With {activity.mentor}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                    </div>
                    {activity.completed && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Completed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/mentee-update"
              className="px-4 py-2 bg-teal-600 rounded-md text-sm font-medium text-white hover:bg-teal-700"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Profile Card */}
              <div className="p-6 text-center">
                <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-teal-500 mb-4">
                  {mentee.profilePicture ? (
                    <img
                      src={mentee.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-500 text-4xl font-bold">
                      {mentee.fullName?.charAt(0) || "M"}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{mentee.fullName}</h2>
                <p className="text-sm text-gray-500">Mentee</p>
                
                {/* Social Links */}
                <div className="flex justify-center space-x-3 mt-4">
                  {mentee.linkedInProfileUrl && (
                    <a href={mentee.linkedInProfileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <FaLinkedin className="text-xl" />
                    </a>
                  )}
                  {mentee.githubProfileUrl && (
                    <a href={mentee.githubProfileUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600">
                      <FaGithub className="text-xl" />
                    </a>
                  )}
                  {mentee.twitterProfileUrl && (
                    <a href={mentee.twitterProfileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                      <FaTwitter className="text-xl" />
                    </a>
                  )}
                  {mentee.personalWebsiteUrl && (
                    <a href={mentee.personalWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                      <FaGlobe className="text-xl" />
                    </a>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-1 flex items-center ${
                    activeTab === "overview" ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <IoStatsChart className="mr-3" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-1 flex items-center ${
                    activeTab === "details" ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <IoPerson className="mr-3" />
                  Personal Details
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-1 flex items-center ${
                    activeTab === "skills" ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <IoCode className="mr-3" />
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-1 flex items-center ${
                    activeTab === "activity" ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <IoTime className="mr-3" />
                  Activity
                </button>
              </nav>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">About Me</h3>
              <p className="text-gray-600 text-sm">
                {mentee.personalIntroduction || "No introduction provided"}
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MenteeProfile;