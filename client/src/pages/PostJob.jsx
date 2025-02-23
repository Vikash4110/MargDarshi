import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IoBriefcaseOutline } from "react-icons/io5";

const PostJob = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    jobType: "Full-Time",
    salaryRange: "",
    applicationDeadline: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/auth/mentor-post-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.split(",").map((r) => r.trim()),
        }),
      });
      if (!response.ok) throw new Error("Failed to post job");
      toast.success("Job posted successfully!");
      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        requirements: "",
        jobType: "Full-Time",
        salaryRange: "",
        applicationDeadline: "",
      });
    } catch (err) {
      toast.error(err.message || "Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <IoBriefcaseOutline className="mr-2 text-teal-500" />
        Post a Job Opportunity
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" className="w-full p-3 border rounded-lg" required />
        <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="w-full p-3 border rounded-lg" required />
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-3 border rounded-lg" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Job Description" className="w-full p-3 border rounded-lg" rows="4" required />
        <input type="text" name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Requirements (comma-separated)" className="w-full p-3 border rounded-lg" required />
        <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
        </select>
        <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} placeholder="Salary Range (optional)" className="w-full p-3 border rounded-lg" />
        <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        <motion.button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 disabled:bg-gray-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Job"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default PostJob;