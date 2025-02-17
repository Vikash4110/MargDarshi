import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const MenteeUpdate = () => {
  const navigate = useNavigate();
  const { authorizationToken } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [mentee, setMentee] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    universityName: "",
    fieldOfStudy: "",
    expectedGraduationYear: "",
    careerInterests: "",
    desiredIndustry: "",
    skillsToDevelop: "",
    typeOfMentorshipSought: "",
    preferredDaysAndTimes: "",
    preferredMentorshipMode: "",
    personalIntroduction: "",
    linkedInProfileUrl: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMenteeData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/auth/mentee-user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch mentee details.");
        }

        const data = await response.json();
        setMentee(data);
      } catch (error) {
        toast.error(error.message || "Something went wrong.");
      }
    };

    fetchMenteeData();
  }, []);

  const handleChange = (e) => {
    setMentee({ ...mentee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(mentee),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      toast.success("Profile updated successfully!");
      navigate("/mentee-user"); // Redirect after 1.5 sec
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Update Your Profile</h2>

      <form onSubmit={handleSubmit} className="mt-6">
        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={mentee.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Email (ReadOnly) */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={mentee.email}
            readOnly
            className="w-full p-2 border bg-gray-100 rounded"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={mentee.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        {/* University Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">University Name</label>
          <input
            type="text"
            name="universityName"
            value={mentee.universityName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Field of Study */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Field of Study</label>
          <input
            type="text"
            name="fieldOfStudy"
            value={mentee.fieldOfStudy}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Preferred Mentorship Mode */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Preferred Mentorship Mode</label>
          <select
            name="preferredMentorshipMode"
            value={mentee.preferredMentorshipMode}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          >
            <option value="">Select</option>
            <option value="Online">Online</option>
            <option value="In-Person">In-Person</option>
          </select>
        </div>

        {/* LinkedIn Profile */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">LinkedIn Profile</label>
          <input
            type="text"
            name="linkedInProfileUrl"
            value={mentee.linkedInProfileUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className={`w-full p-3 text-white rounded bg-blue-500 hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenteeUpdate;
