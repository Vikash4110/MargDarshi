// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { useAuth } from "../store/auth";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaLink, FaPaperPlane, FaSpinner } from "react-icons/fa";

// const UpdateCalendly = () => {
//   const [calendlyLink, setCalendlyLink] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { authorizationToken } = useAuth();
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const handleUpdate = async () => {
//     if (!calendlyLink) {
//       toast.error("Please enter your Calendly link.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${backendUrl}/api/auth/update-calendly`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify({ calendlyLink }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Failed to update Calendly link");
//       }

//       toast.success("Calendly link updated successfully!");
//       setCalendlyLink("");
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100 mt-12"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f6f5c] to-teal-400" />
//       {/* Title */}
//       <h2 className="text-3xl font-extrabold text-[#127C71] text-center mb-6 tracking-tight">
//         Update Your Calendly Link
//       </h2>

//       {/* Instructions */}
//       <motion.div
//         className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.2, duration: 0.5 }}
//       >
//         <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//           <FaLink className="mr-2 text-teal-500" /> How to Generate a Calendly Link
//         </h3>
//         <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
//           <li>
//             Visit{" "}
//             <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">
//               Calendly
//             </a>{" "}
//             and log in or sign up.
//           </li>
//           <li>Create a <strong>New Event Type</strong> and configure your availability.</li>
//           <li>Copy the link from the event page (e.g., <em>https://calendly.com/username/event</em>).</li>
//           <li>Paste it below and click <strong>Update</strong>.</li>
//         </ol>
//       </motion.div>

//       {/* Input Field */}
//       <motion.div
//         className="relative mb-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.4, duration: 0.5 }}
//       >
//         <input
//           type="text"
//           className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-800 placeholder-gray-400"
//           placeholder="Paste your Calendly link here (e.g., https://calendly.com/username/event)"
//           value={calendlyLink}
//           onChange={(e) => setCalendlyLink(e.target.value)}
//         />
//       </motion.div>

//       {/* Update Button */}
//       <motion.button
//         onClick={handleUpdate}
//         className={`w-full py-3 rounded-lg font-semibold text-white shadow-md flex items-center justify-center transition duration-300 ${
//           loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#0f6f5c] to-teal-500 hover:from-teal-600 hover:to-teal-700"
//         }`}
//         whileHover={!loading && { scale: 1.05 }}
//         whileTap={!loading && { scale: 0.95 }}
//         disabled={loading}
//       >
//         {loading ? (
//           <>
//             <FaSpinner className="animate-spin mr-2" /> Updating...
//           </>
//         ) : (
//           <>
//             <FaPaperPlane className="mr-2" /> Update Link
//           </>
//         )}
//       </motion.button>
//     </motion.div>
//   );
// };

// export default UpdateCalendly;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLink, FaPaperPlane, FaSpinner, FaClipboard, FaCheckCircle } from "react-icons/fa";
import { SiCalendly } from "react-icons/si";

const UpdateCalendly = () => {
  const [calendlyLink, setCalendlyLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { authorizationToken } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleUpdate = async () => {
    if (!calendlyLink) {
      toast.error("Please enter your Calendly link");
      return;
    }

    // Validate Calendly URL format
    if (!calendlyLink.match(/^https?:\/\/(www\.)?calendly\.com\/.+/i)) {
      toast.error("Please enter a valid Calendly URL (e.g., https://calendly.com/yourname)");
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

      toast.success("Scheduling link updated successfully!");
      setCalendlyLink("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyExampleLink = () => {
    const exampleLink = "https://calendly.com/yourname/30min";
    navigator.clipboard.writeText(exampleLink);
    setCopied(true);
    toast.info("Example link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with Calendly branding */}
      <div className="bg-gradient-to-r from-[#006BFF] to-[#00A1FF] p-6 text-white">
        <div className="flex items-center space-x-3">
          <SiCalendly className="text-3xl" />
          <div>
            <h1 className="text-2xl font-bold">Connect Your Calendly</h1>
            <p className="mt-1 opacity-90 text-sm">
              Streamline your mentoring sessions with automated scheduling
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Visual Guide Section */}
        <div className="mb-8 bg-blue-50 p-5 rounded-lg border border-blue-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <FaLink className="mr-2 text-blue-500" />
            How to Find Your Calendly Link
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-blue-500 font-bold text-sm mb-1">STEP 1</div>
              <h3 className="font-medium mb-2">Log in to Calendly</h3>
              <p className="text-sm text-gray-600">
                Go to calendly.com and sign in to your account
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-blue-500 font-bold text-sm mb-1">STEP 2</div>
              <h3 className="font-medium mb-2">Navigate to Event Types</h3>
              <p className="text-sm text-gray-600">
                Click on "Event Types" in the left sidebar
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-blue-500 font-bold text-sm mb-1">STEP 3</div>
              <h3 className="font-medium mb-2">Copy Your Link</h3>
              <p className="text-sm text-gray-600">
                Click "Share" and copy the public link
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center text-sm">
            <button 
              onClick={copyExampleLink}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              {copied ? (
                <FaCheckCircle className="mr-1 text-green-500" />
              ) : (
                <FaClipboard className="mr-1" />
              )}
              {copied ? "Copied!" : "Copy example link"}
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <label htmlFor="calendly-link" className="block text-sm font-medium text-gray-700 mb-2">
            Your Calendly URL
          </label>
          <div className="relative">
            <input
              id="calendly-link"
              type="url"
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://calendly.com/yourname/30min"
              value={calendlyLink}
              onChange={(e) => setCalendlyLink(e.target.value)}
            />
            {calendlyLink && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(calendlyLink);
                  toast.info("Link copied to clipboard!");
                }}
                className="absolute right-3 top-3 text-gray-500 hover:text-blue-600"
                title="Copy to clipboard"
              >
                <FaClipboard />
              </button>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Must be a valid Calendly.com URL
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 mb-6">
          <h3 className="text-sm font-semibold text-teal-800 mb-2">Why Connect Calendly?</h3>
          <ul className="space-y-2 text-sm text-teal-700">
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✓</span>
              <span>Eliminate scheduling back-and-forth emails</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✓</span>
              <span>Automatically prevent double bookings</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✓</span>
              <span>Sync with your personal calendar availability</span>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleUpdate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3.5 rounded-lg font-semibold text-white shadow-md flex items-center justify-center transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Connecting...
            </>
          ) : (
            <>
              <SiCalendly className="mr-2" /> Connect Calendly Account
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UpdateCalendly;