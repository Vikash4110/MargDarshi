import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      setCalendlyLink(""); // Clear input after success
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-lg mx-auto p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg rounded-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-4">Update Your Calendly Link</h2>

      {/* Steps to Generate Calendly Link */}
      <div className="bg-white text-gray-800 p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold mb-2">How to Generate a Calendly Link?</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>
            Go to <a href="https://calendly.com/" target="_blank" className="text-blue-500 underline">Calendly</a> and log in.
          </li>
          <li>Click on <strong>"New Event Type"</strong> and set up your availability.</li>
          <li>Once done, click on <strong>"Copy Link"</strong> at the top.</li>
          <li>Paste the link below and click <strong>"Update"</strong>.</li>
        </ol>
      </div>

      {/* Input Field */}
      <input
        type="text"
        className="w-full p-3 text-gray-800 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Paste your Calendly link here"
        value={calendlyLink}
        onChange={(e) => setCalendlyLink(e.target.value)}
      />

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        className={`mt-4 w-full py-3 rounded-md text-lg font-semibold shadow-md transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Link"}
      </button>
    </motion.div>
  );
};

export default UpdateCalendly;
