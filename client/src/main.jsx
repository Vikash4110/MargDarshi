import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from "./store/auth";
import { FaTimes, FaCheck , FaPaperPlane } from "react-icons/fa";
import { motion } from 'framer-motion'; // For animations

createRoot(document.getElementById('root')).render(
  <>
    <AuthProvider>
      <App />
      <ToastContainer
        position="top-right" // Dynamic position, can be changed
        autoClose={1000} // Closes after 3 seconds
        hideProgressBar={false} // Show progress bar for a premium feel
        newestOnTop={true} // Stack new toasts on top
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Base theme, we'll override with custom styles
        toastStyle={{
          background: 'linear-gradient(to right, #0f6f5c, #14b8a6)', // Teal gradient matching your design
          color: '#ffffff', // White text for contrast
          borderRadius: '12px', // Rounded corners for a modern look
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
          fontFamily: 'inherit', // Match your site's font
          fontSize: '16px', // Readable size
          padding: '12px 20px', // Comfortable padding
          border: '1px solid rgba(255, 255, 255, 0.2)', // Light border for elegance
        }}
        progressStyle={{
          background: '#ffffff', // White progress bar for contrast
          height: '4px', // Slimmer progress bar
          borderRadius: '4px', // Rounded progress
        }}
        closeButton={({ closeToast }) => (
          <motion.button
            onClick={closeToast}
            className="text-white hover:text-gray-200 focus:outline-none"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes size={18} />
          </motion.button>
        )}
        icon={({ type }) => (
          type === 'success' ? <FaCheck className="text-white" size={20} /> :
          type === 'error' ? <FaTimes className="text-white" size={20} /> :
          <FaPaperPlane className="text-white" size={20} /> // Default/info icon
        )}
      />
    </AuthProvider>
  </>
);