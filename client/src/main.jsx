import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from "./store/auth";

createRoot(document.getElementById('root')).render(
  <>
    <AuthProvider>
    <App />
    <ToastContainer/>
    </AuthProvider>
    </>
    )
