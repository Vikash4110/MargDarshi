// src/pages/UpdateAvailability.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaClock, FaPlus, FaSave, FaTrash } from "react-icons/fa";

const UpdateAvailability = () => {
  const { authorizationToken } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [availability, setAvailability] = useState([
    { day: "Monday", timeSlots: [] },
    { day: "Tuesday", timeSlots: [] },
    { day: "Wednesday", timeSlots: [] },
    { day: "Thursday", timeSlots: [] },
    { day: "Friday", timeSlots: [] },
    { day: "Saturday", timeSlots: [] },
    { day: "Sunday", timeSlots: [] },
  ]);
  const [loading, setLoading] = useState(false);

  const addTimeSlot = (dayIndex) => {
    setAvailability((prev) => {
      const newAvailability = [...prev];
      newAvailability[dayIndex].timeSlots.push({ startTime: "", endTime: "" });
      return newAvailability;
    });
  };

  const updateTimeSlot = (dayIndex, slotIndex, field, value) => {
    setAvailability((prev) => {
      const newAvailability = [...prev];
      newAvailability[dayIndex].timeSlots[slotIndex][field] = value;
      return newAvailability;
    });
  };

  const removeTimeSlot = (dayIndex, slotIndex) => {
    setAvailability((prev) => {
      const newAvailability = [...prev];
      newAvailability[dayIndex].timeSlots.splice(slotIndex, 1);
      return newAvailability;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/update-availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ availability }),
      });

      if (!response.ok) throw new Error("Failed to update availability");
      toast.success("Availability updated successfully!");
    } catch (err) {
      toast.error(err.message || "Error updating availability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-extrabold text-[#127C71] text-center mb-6">Set Your Availability</h2>
      {availability.map((day, dayIndex) => (
        <div key={day.day} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaClock className="mr-2 text-teal-500" /> {day.day}
          </h3>
          {day.timeSlots.map((slot, slotIndex) => (
            <div key={slotIndex} className="flex items-center space-x-4 mb-2">
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => updateTimeSlot(dayIndex, slotIndex, "startTime", e.target.value)}
                className="p-2 border rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-gray-600">to</span>
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => updateTimeSlot(dayIndex, slotIndex, "endTime", e.target.value)}
                className="p-2 border rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            onClick={() => addTimeSlot(dayIndex)}
            className="text-teal-600 hover:text-teal-800 flex items-center mt-2"
          >
            <FaPlus className="mr-1" /> Add Time Slot
          </button>
        </div>
      ))}
      <motion.button
        onClick={handleSave}
        className={`w-full py-3 mt-6 rounded-lg font-semibold text-white flex items-center justify-center ${
          loading ? "bg-gray-400" : "bg-gradient-to-r from-[#0f6f5c] to-teal-500 hover:from-teal-600 hover:to-teal-700"
        }`}
        whileHover={!loading && { scale: 1.05 }}
        whileTap={!loading && { scale: 0.95 }}
        disabled={loading}
      >
        {loading ? "Saving..." : <><FaSave className="mr-2" /> Save Availability</>}
      </motion.button>
    </motion.div>
  );
};

export default UpdateAvailability;