// src/components/ScheduleMeeting.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaCalendar, FaTimes } from "react-icons/fa";

const ScheduleMeeting = ({ mentor, user, onClose, authorizationToken, backendUrl, isMentorView = false }) => {
  const [availability, setAvailability] = useState([]);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/auth/schedule`, {
          headers: { Authorization: authorizationToken },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch availability");
        setAvailability(data.availability || []);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchAvailability();
  }, [backendUrl, authorizationToken]);

  const handleSchedule = async () => {
    if (!date || !selectedSlot) {
      toast.error("Please select a date and time slot");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/schedule-meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({
          menteeId: isMentorView ? mentor._id : user._id,
          date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        }),
      });

      if (!response.ok) throw new Error("Failed to schedule meeting");
      toast.success("Meeting scheduled successfully!");
      onClose();
    } catch (err) {
      toast.error(err.message || "Error scheduling meeting");
    } finally {
      setLoading(false);
    }
  };

  const availableSlots = availability.find((a) => a.day === new Date(date).toLocaleString("en-US", { weekday: "long" }))?.timeSlots || [];

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#127C71]">Schedule Meeting with {mentor.fullName}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSelectedSlot(null); // Reset selected slot when date changes
            }}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        {date && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Available Time Slots</label>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 border rounded-lg text-center ${
                      selectedSlot?.startTime === slot.startTime && selectedSlot?.endTime === slot.endTime
                        ? "bg-teal-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {slot.startTime} - {slot.endTime}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No available slots for this day.</p>
            )}
          </div>
        )}
        <button
          onClick={handleSchedule}
          className={`w-full py-2 rounded-lg font-semibold text-white ${
            loading || !date || !selectedSlot ? "bg-gray-400 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"
          }`}
          disabled={loading || !date || !selectedSlot}
        >
          {loading ? "Scheduling..." : "Schedule Meeting"}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ScheduleMeeting;