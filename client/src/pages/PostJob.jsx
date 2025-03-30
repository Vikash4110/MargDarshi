// import { useState } from "react";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import { IoBriefcaseOutline } from "react-icons/io5";

// const PostJob = () => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [formData, setFormData] = useState({
//     title: "",
//     company: "",
//     location: "",
//     description: "",
//     requirements: "",
//     jobType: "Full-Time",
//     salaryRange: "",
//     applicationDeadline: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${backendUrl}/api/auth/mentor-post-job`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           ...formData,
//           requirements: formData.requirements.split(",").map((r) => r.trim()),
//         }),
//       });
//       if (!response.ok) throw new Error("Failed to post job");
//       toast.success("Job posted successfully!");
//       setFormData({
//         title: "",
//         company: "",
//         location: "",
//         description: "",
//         requirements: "",
//         jobType: "Full-Time",
//         salaryRange: "",
//         applicationDeadline: "",
//       });
//     } catch (err) {
//       toast.error(err.message || "Error posting job");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
//         <IoBriefcaseOutline className="mr-2 text-teal-500" />
//         Post a Job Opportunity
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" className="w-full p-3 border rounded-lg" required />
//         <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="w-full p-3 border rounded-lg" required />
//         <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-3 border rounded-lg" required />
//         <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Job Description" className="w-full p-3 border rounded-lg" rows="4" required />
//         <input type="text" name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Requirements (comma-separated)" className="w-full p-3 border rounded-lg" required />
//         <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
//           <option value="Full-Time">Full-Time</option>
//           <option value="Part-Time">Part-Time</option>
//           <option value="Internship">Internship</option>
//           <option value="Contract">Contract</option>
//           <option value="Freelance">Freelance</option>
//         </select>
//         <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} placeholder="Salary Range (optional)" className="w-full p-3 border rounded-lg" />
//         <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
//         <motion.button
//           type="submit"
//           className="w-full py-3 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 disabled:bg-gray-400"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           disabled={loading}
//         >
//           {loading ? "Posting..." : "Post Job"}
//         </motion.button>
//       </form>
//     </motion.div>
//   );
// };

// export default PostJob;


import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IoBriefcaseOutline, IoLocationOutline, IoBusinessOutline, IoDocumentTextOutline, IoListOutline, IoCashOutline, IoCalendarOutline } from "react-icons/io5";

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
    contactEmail: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.description.trim() || formData.description.length < 50) 
      newErrors.description = "Description must be at least 50 characters";
    if (!formData.requirements.trim()) newErrors.requirements = "At least one requirement is needed";
    if (!formData.applicationDeadline) newErrors.applicationDeadline = "Deadline is required";
    if (formData.contactEmail && !/^\S+@\S+\.\S+$/.test(formData.contactEmail)) 
      newErrors.contactEmail = "Invalid email format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post job");
      }
      
      toast.success("Job posted successfully!", {
        autoClose: 3000,
        position: "top-center",
      });
      
      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        requirements: "",
        jobType: "Full-Time",
        salaryRange: "",
        applicationDeadline: "",
        contactEmail: ""
      });
    } catch (err) {
      toast.error(err.message || "Error posting job", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const jobTypes = [
    "Full-Time",
    "Part-Time",
    "Internship",
    "Contract",
    "Freelance",
    "Remote"
  ];

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-teal-50">
          <IoBriefcaseOutline className="text-3xl text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Post a Job Opportunity</h2>
        <p className="text-gray-600">Fill out the form below to list your job opening</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <IoBriefcaseOutline className="mr-2 text-teal-600" />
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior Frontend Developer"
            className={`w-full p-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
            required
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
        
        {/* Company & Location Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <IoBusinessOutline className="mr-2 text-teal-600" />
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company name"
              className={`w-full p-3 border ${errors.company ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
              required
            />
            {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <IoLocationOutline className="mr-2 text-teal-600" />
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, NY or Remote"
              className={`w-full p-3 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
              required
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>
        </div>
        
        {/* Job Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <IoDocumentTextOutline className="mr-2 text-teal-600" />
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities, and what makes your company great"
            className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[120px]`}
            rows="5"
            required
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-sm text-red-600">{errors.description}</p>
            ) : (
              <p className="text-xs text-gray-500">Minimum 50 characters</p>
            )}
            <span className="text-xs text-gray-500">{formData.description.length}/2000</span>
          </div>
        </div>
        
        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <IoListOutline className="mr-2 text-teal-600" />
            Requirements *
          </label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="List requirements separated by commas (e.g. 3+ years experience, React knowledge, Bachelor's degree)"
            className={`w-full p-3 border ${errors.requirements ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[80px]`}
            required
          />
          {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
        </div>
        
        {/* Job Type & Salary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <IoBriefcaseOutline className="mr-2 text-teal-600" />
              Job Type *
            </label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            >
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <IoCashOutline className="mr-2 text-teal-600" />
              Salary Range (optional)
            </label>
            <input
              type="text"
              id="salaryRange"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              placeholder="e.g. $80,000 - $100,000 per year"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Deadline & Contact Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <IoCalendarOutline className="mr-2 text-teal-600" />
              Application Deadline *
            </label>
            <input
              type="date"
              id="applicationDeadline"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full p-3 border ${errors.applicationDeadline ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
              required
            />
            {errors.applicationDeadline && <p className="mt-1 text-sm text-red-600">{errors.applicationDeadline}</p>}
          </div>
          
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email (optional)
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="contact@company.com"
              className={`w-full p-3 border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
            />
            {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
          </div>
        </div>
        
        <div className="pt-4">
          <motion.button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-medium rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting Job...
              </span>
            ) : (
              "Post Job Opportunity"
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default PostJob;