import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLink, FaPaperPlane, FaSpinner } from "react-icons/fa";

const UpdateCalendly = () => {
  const [calendlyLink, setCalendlyLink] = useState("");
  const [loading, setLoading] = useState(false);
  const { authorizationToken } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleUpdate = async () => {
    if (!calendlyLink) {
      toast.error("Please enter your Calendly link.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/update-calendly`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ calendlyLink }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update Calendly link");
      }

      toast.success("Calendly link updated successfully!");
      setCalendlyLink("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100 mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f6f5c] to-teal-400" />
      {/* Title */}
      <h2 className="text-3xl font-extrabold text-[#127C71] text-center mb-6 tracking-tight">
        Update Your Calendly Link
      </h2>

      {/* Instructions */}
      <motion.div
        className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <FaLink className="mr-2 text-teal-500" /> How to Generate a Calendly Link
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>
            Visit{" "}
            <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">
              Calendly
            </a>{" "}
            and log in or sign up.
          </li>
          <li>Create a <strong>New Event Type</strong> and configure your availability.</li>
          <li>Copy the link from the event page (e.g., <em>https://calendly.com/username/event</em>).</li>
          <li>Paste it below and click <strong>Update</strong>.</li>
        </ol>
      </motion.div>

      {/* Input Field */}
      <motion.div
        className="relative mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-800 placeholder-gray-400"
          placeholder="Paste your Calendly link here (e.g., https://calendly.com/username/event)"
          value={calendlyLink}
          onChange={(e) => setCalendlyLink(e.target.value)}
        />
      </motion.div>

      {/* Update Button */}
      <motion.button
        onClick={handleUpdate}
        className={`w-full py-3 rounded-lg font-semibold text-white shadow-md flex items-center justify-center transition duration-300 ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#0f6f5c] to-teal-500 hover:from-teal-600 hover:to-teal-700"
        }`}
        whileHover={!loading && { scale: 1.05 }}
        whileTap={!loading && { scale: 0.95 }}
        disabled={loading}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin mr-2" /> Updating...
          </>
        ) : (
          <>
            <FaPaperPlane className="mr-2" /> Update Link
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default UpdateCalendly;