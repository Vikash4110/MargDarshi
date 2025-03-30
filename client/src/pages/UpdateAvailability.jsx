// // src/pages/UpdateAvailability.jsx
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { useAuth } from "../store/auth";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaClock, FaPlus, FaSave, FaTrash } from "react-icons/fa";

// const UpdateAvailability = () => {
//   const { authorizationToken } = useAuth();
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [availability, setAvailability] = useState([
//     { day: "Monday", timeSlots: [] },
//     { day: "Tuesday", timeSlots: [] },
//     { day: "Wednesday", timeSlots: [] },
//     { day: "Thursday", timeSlots: [] },
//     { day: "Friday", timeSlots: [] },
//     { day: "Saturday", timeSlots: [] },
//     { day: "Sunday", timeSlots: [] },
//   ]);
//   const [loading, setLoading] = useState(false);

//   const addTimeSlot = (dayIndex) => {
//     setAvailability((prev) => {
//       const newAvailability = [...prev];
//       newAvailability[dayIndex].timeSlots.push({ startTime: "", endTime: "" });
//       return newAvailability;
//     });
//   };

//   const updateTimeSlot = (dayIndex, slotIndex, field, value) => {
//     setAvailability((prev) => {
//       const newAvailability = [...prev];
//       newAvailability[dayIndex].timeSlots[slotIndex][field] = value;
//       return newAvailability;
//     });
//   };

//   const removeTimeSlot = (dayIndex, slotIndex) => {
//     setAvailability((prev) => {
//       const newAvailability = [...prev];
//       newAvailability[dayIndex].timeSlots.splice(slotIndex, 1);
//       return newAvailability;
//     });
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${backendUrl}/api/auth/update-availability`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify({ availability }),
//       });

//       if (!response.ok) throw new Error("Failed to update availability");
//       toast.success("Availability updated successfully!");
//     } catch (err) {
//       toast.error(err.message || "Error updating availability");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-12"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <h2 className="text-3xl font-extrabold text-[#127C71] text-center mb-6">Set Your Availability</h2>
//       {availability.map((day, dayIndex) => (
//         <div key={day.day} className="mb-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
//             <FaClock className="mr-2 text-teal-500" /> {day.day}
//           </h3>
//           {day.timeSlots.map((slot, slotIndex) => (
//             <div key={slotIndex} className="flex items-center space-x-4 mb-2">
//               <input
//                 type="time"
//                 value={slot.startTime}
//                 onChange={(e) => updateTimeSlot(dayIndex, slotIndex, "startTime", e.target.value)}
//                 className="p-2 border rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-teal-500"
//               />
//               <span className="text-gray-600">to</span>
//               <input
//                 type="time"
//                 value={slot.endTime}
//                 onChange={(e) => updateTimeSlot(dayIndex, slotIndex, "endTime", e.target.value)}
//                 className="p-2 border rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-teal-500"
//               />
//               <button
//                 onClick={() => removeTimeSlot(dayIndex, slotIndex)}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           ))}
//           <button
//             onClick={() => addTimeSlot(dayIndex)}
//             className="text-teal-600 hover:text-teal-800 flex items-center mt-2"
//           >
//             <FaPlus className="mr-1" /> Add Time Slot
//           </button>
//         </div>
//       ))}
//       <motion.button
//         onClick={handleSave}
//         className={`w-full py-3 mt-6 rounded-lg font-semibold text-white flex items-center justify-center ${
//           loading ? "bg-gray-400" : "bg-gradient-to-r from-[#0f6f5c] to-teal-500 hover:from-teal-600 hover:to-teal-700"
//         }`}
//         whileHover={!loading && { scale: 1.05 }}
//         whileTap={!loading && { scale: 0.95 }}
//         disabled={loading}
//       >
//         {loading ? "Saving..." : <><FaSave className="mr-2" /> Save Availability</>}
//       </motion.button>
//     </motion.div>
//   );
// };

// export default UpdateAvailability;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaClock, FaPlus, FaSave, FaTrash, FaCalendarAlt, FaLink } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

const UpdateAvailability = () => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const [availability, setAvailability] = useState(
    daysOfWeek.map(day => ({ 
      day, 
      timeSlots: [], 
      enabled: true 
    }))
  );
  
  const [calendlyLink, setCalendlyLink] = useState("");
  const [activeTab, setActiveTab] = useState("availability");
  const [loading, setLoading] = useState(false);

  const addTimeSlot = (dayIndex) => {
    setAvailability(prev => {
      const newAvailability = [...prev];
      newAvailability[dayIndex].timeSlots.push({ 
        startTime: "09:00", 
        endTime: "10:00" 
      });
      return newAvailability;
    });
  };

  const updateTimeSlot = (dayIndex, slotIndex, field, value) => {
    setAvailability(prev => {
      const newAvailability = [...prev];
      newAvailability[dayIndex].timeSlots[slotIndex][field] = value;
      return newAvailability;
    });
  };

  const removeTimeSlot = (dayIndex, slotIndex) => {
    setAvailability(prev => {
      const newAvailability = [...prev];
      newAvailability[dayIndex].timeSlots.splice(slotIndex, 1);
      return newAvailability;
    });
  };

  const toggleDayEnabled = (dayIndex) => {
    setAvailability(prev => {
      const newAvailability = [...prev];
      newAvailability[dayIndex].enabled = !newAvailability[dayIndex].enabled;
      return newAvailability;
    });
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate save operation
    setTimeout(() => {
      setLoading(false);
      alert("Availability and meeting settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <FaCalendarAlt className="mr-3" />
                Mentor Availability
              </h1>
              <p className="mt-1 opacity-90">
                Set when you're available for mentorship sessions
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("availability")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${activeTab === "availability" ? "border-teal-500 text-teal-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              <FaClock className="mr-2" />
              Availability
            </button>
            <button
              onClick={() => setActiveTab("meeting")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${activeTab === "meeting" ? "border-teal-500 text-teal-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              <FaLink className="mr-2" />
              Meeting Link
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "availability" ? (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Weekly Availability
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availability.map((day, dayIndex) => (
                  <div 
                    key={day.day}
                    className={`border rounded-lg overflow-hidden transition-all ${day.enabled ? "border-teal-200 bg-teal-50" : "border-gray-200 bg-gray-50"}`}
                  >
                    <div className="p-3 border-b flex justify-between items-center">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleDayEnabled(dayIndex)}
                          className={`w-5 h-5 rounded mr-3 flex items-center justify-center transition-colors ${day.enabled ? "bg-teal-500" : "bg-gray-300"}`}
                        >
                          {day.enabled && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <h3 className="font-medium text-gray-800">{day.day}</h3>
                      </div>
                      {day.enabled && (
                        <button
                          onClick={() => addTimeSlot(dayIndex)}
                          className="text-sm text-teal-600 hover:text-teal-800 flex items-center"
                        >
                          <FaPlus className="mr-1" /> Add Slot
                        </button>
                      )}
                    </div>
                    
                    {day.enabled && (
                      <div className="p-3 space-y-2">
                        {day.timeSlots.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-2">
                            No time slots added
                          </p>
                        ) : (
                          day.timeSlots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="flex items-center bg-white p-2 rounded border border-gray-200">
                              <div className="flex-1 flex items-center">
                                <IoMdTime className="text-teal-500 mr-2" />
                                <input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) => updateTimeSlot(dayIndex, slotIndex, "startTime", e.target.value)}
                                  className="bg-transparent border-none focus:ring-0 p-0 text-gray-700 w-24"
                                />
                                <span className="mx-2 text-gray-400">to</span>
                                <input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) => updateTimeSlot(dayIndex, slotIndex, "endTime", e.target.value)}
                                  className="bg-transparent border-none focus:ring-0 p-0 text-gray-700 w-24"
                                />
                              </div>
                              <button
                                onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Calendly Meeting Link
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <FaLink className="text-blue-500 text-xl" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Connect Your Calendly
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Paste your Calendly link below to allow mentees to schedule meetings during your available times.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Your Calendly URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    https://
                  </span>
                  <input
                    type="text"
                    value={calendlyLink}
                    onChange={(e) => setCalendlyLink(e.target.value)}
                    placeholder="calendly.com/yourname"
                    className="focus:ring-teal-500 focus:border-teal-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Example: calendly.com/johndoe/30min
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-800 mb-2">
                  How to get your Calendly link:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Log in to your Calendly account</li>
                  <li>Go to your scheduling page</li>
                  <li>Copy the URL from your browser's address bar</li>
                  <li>Paste it in the field above</li>
                </ol>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-8">
            <motion.button
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSave}
              className={`px-6 py-2.5 rounded-lg text-white flex items-center ${loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"}`}
              whileHover={!loading && { scale: 1.03 }}
              whileTap={!loading && { scale: 0.97 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Settings
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateAvailability;