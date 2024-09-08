import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { RotatingLines } from "react-loader-spinner"; // Assuming you're using this package for the loading animation

const backendUrl = import.meta.env.VITE_BACKEND_URL; // Environment variable for backend URL

const MentorLogin = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    if (!backendUrl) {
      toast.error("Backend URL is not defined. Please check your environment variables.");
      setLoading(false); // Stop loading if error
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const responseData = await response.json();

      if (response.ok) {
        storeTokenInLS(responseData.token); // Store token
        toast.success("Login Successful");
        navigate("/"); // Redirect after login
      } else {
        toast.error(responseData.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 w-full max-w-md mx-auto mt-6 text-center border-2 rounded-3xl py-10 lg:py-20 px-6 lg:px-10 shadow-2xl"
    >
      {/* Email Input */}
      <div className="relative h-11 w-full">
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleInputChange}
          placeholder=""
          className="shadow-xl peer h-full w-full rounded-xl border border-gray-300 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-gray-700 outline-none transition-all placeholder-shown:border placeholder-shown:border-gray-200 placeholder-shown:border-t-gray-200 focus:border-2 focus:border-[#ed1f26] focus:border-t-transparent focus:border-r-transparent focus:border-l-transparent disabled:border-0 disabled:bg-gray-50"
          required
        />
        <label className="pointer-events-none absolute left-3 -top-1.5 flex items-center space-x-2 select-none text-[12px] font-medium leading-tight text-gray-800 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-1.5 peer-focus:text-[12px] peer-focus:text-[#ed1f26]">
          <FontAwesomeIcon icon={faEnvelope} />
          <span>Email</span>
        </label>
      </div>

      {/* Password Input */}
      <div className="relative h-11 w-full">
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          placeholder=""
          className="shadow-xl peer h-full w-full rounded-xl border border-gray-300 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-gray-700 outline-none transition-all placeholder-shown:border placeholder-shown:border-gray-200 placeholder-shown:border-t-gray-200 focus:border-2 focus:border-b-[#ed1f26] focus:border-t-transparent focus:border-r-transparent focus:border-l-transparent disabled:border-0 disabled:bg-gray-50"
          required
        />
        <label className="pointer-events-none absolute left-3 -top-1.5 flex items-center space-x-2 select-none text-[12px] font-medium leading-tight text-gray-800 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-1.5 peer-focus:text-[12px] peer-focus:text-[#ed1f26]">
          <FontAwesomeIcon icon={faLock} />
          <span>Password</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`py-2 px-4 rounded-full mt-6 font-medium text-white w-1/2 mx-auto block bg-gradient-to-r from-purple-500 to-red-500 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="24" visible={true} />
          </div>
        ) : (
          "Login"
        )}
      </button>

      {/* Links */}
      <div className="flex flex-col items-center mt-4 space-y-2">
        <p className="text-sm text-gray-600">
          New Here?{" "}
          <Link to="/mentor-register" className="text-[#ed1f26] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );
};

export default MentorLogin;
