import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from "./store/auth";
import { FaTimes, FaCheck, FaPaperPlane } from "react-icons/fa";
import { motion } from 'framer-motion';

const customToastStyle = {
  background: 'linear-gradient(to right, #0f6f5c, #14b8a6)',
  color: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  fontFamily: 'inherit',
  fontSize: '16px',
  padding: '12px 20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastStyle={customToastStyle}
      progressStyle={{
        background: '#ffffff',
        height: '4px',
        borderRadius: '4px',
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
        <FaPaperPlane className="text-white" size={20} />
      )}
    />
  </AuthProvider>
);