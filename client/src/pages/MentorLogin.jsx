import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { RotatingLines } from "react-loader-spinner";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MentorLogin = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!backendUrl) {
      toast.error("Backend URL is not defined. Please check your environment variables.");
      setLoading(false);
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
        storeTokenInLS(responseData.token);
        toast.success("Login Successful");
        navigate("/mentor-show");
      } else {
        toast.error(responseData.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Mentor Login
        </h2>

        {/* Email Input */}
        <div className="relative w-full mb-5">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Email
          </label>
          <div className="relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-10 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-gray-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="relative w-full mb-5">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Password
          </label>
          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-4 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-10 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-gray-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 mt-4 rounded-lg bg-gray-800 text-white font-semibold text-lg transition-all hover:bg-gray-900 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
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

        {/* Additional Links */}
        <div className="flex flex-col items-center mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            New Here?{" "}
            <Link to="/mentor-register" className="text-gray-800 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default MentorLogin;
