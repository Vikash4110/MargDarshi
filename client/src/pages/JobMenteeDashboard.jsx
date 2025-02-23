import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IoBriefcaseOutline, IoClose, IoEyeOutline, IoBusiness, IoLocationSharp, IoPerson, IoCashOutline, IoCalendarOutline, IoListOutline, IoPaperPlaneOutline } from "react-icons/io5";

const MenteeDashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applyJobId, setApplyJobId] = useState(null);
  const [applicationData, setApplicationData] = useState({ resumeUrl: "", coverLetter: "" });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/auth/jobs/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      setJobs(data.jobs);
    } catch (err) {
      toast.error(err.message || "Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/auth/jobs/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      setApplications(data.applications.map(app => app.jobId._id));
    } catch (err) {
      toast.error(err.message || "Error loading applications");
    }
  };

  const applyToJob = async (jobId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/auth/jobs/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId, ...applicationData }),
      });
      if (!response.ok) throw new Error("Failed to apply");
      toast.success("Application submitted successfully!");
      setApplyJobId(null);
      setSelectedJobId(null);
      setApplicationData({ resumeUrl: "", coverLetter: "" });
      fetchJobs();
      fetchApplications();
    } catch (err) {
      toast.error(err.message || "Error applying to job");
    } finally {
      setLoading(false);
    }
  };

  const hasApplied = (jobId) => applications.includes(jobId);

  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 p-8 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <motion.h1
            className="text-4xl font-extrabold text-gray-800 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Mentee Dashboard
          </motion.h1>
          <Link to="/mentee-applications">
            <motion.button
              className="py-2 px-4 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoPaperPlaneOutline className="mr-2" />
              Your Applied Applications
            </motion.button>
          </Link>
        </div>

        {/* Job Opportunities Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <IoBriefcaseOutline className="mr-2 text-teal-500" />
            Job Opportunities
          </h2>
          {loading && !selectedJobId ? (
            <p className="text-gray-600 text-center">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600 text-center">No job opportunities available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <motion.div
                  key={job._id}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: jobs.indexOf(job) * 0.1, duration: 0.4 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                  <p className="text-gray-600">{job.company} - {job.location}</p>
                  <p className="text-sm text-gray-500 mt-2">Posted by: {job.mentorId.fullName}</p>
                  <p className="text-sm text-gray-500">Type: {job.jobType}</p>
                  <p className="text-sm text-gray-500">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                  <motion.button
                    onClick={() => setSelectedJobId(job._id)}
                    className="mt-4 w-full py-2 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 disabled:bg-gray-400 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    <IoEyeOutline className="mr-2" />
                    View Job
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Full-Screen Job Details Modal */}
        {selectedJobId && (
          <motion.div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {jobs.filter(job => job._id === selectedJobId).map((job) => (
                <div key={job._id} className="space-y-6 text-gray-800">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-3xl font-bold text-gray-800 flex items-center">
                      <IoBriefcaseOutline className="mr-2 text-teal-500" />
                      {job.title}
                    </h3>
                    <IoClose
                      className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800"
                      onClick={() => setSelectedJobId(null)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="flex items-center">
                      <IoBusiness className="mr-2 text-teal-500" />
                      <strong>Company:</strong> <span className="ml-2">{job.company}</span>
                    </p>
                    <p className="flex items-center">
                      <IoLocationSharp className="mr-2 text-teal-500" />
                      <strong>Location:</strong> <span className="ml-2">{job.location}</span>
                    </p>
                    <p className="flex items-center">
                      <IoPerson className="mr-2 text-teal-500" />
                      <strong>Posted by:</strong> <span className="ml-2">{job.mentorId.fullName}</span>
                    </p>
                    <p className="flex items-center">
                      <IoBriefcaseOutline className="mr-2 text-teal-500" />
                      <strong>Type:</strong> <span className="ml-2">{job.jobType}</span>
                    </p>
                    <p className="flex items-center">
                      <IoCashOutline className="mr-2 text-teal-500" />
                      <strong>Salary Range:</strong> <span className="ml-2">{job.salaryRange || "Not specified"}</span>
                    </p>
                    <p className="flex items-center">
                      <IoCalendarOutline className="mr-2 text-teal-500" />
                      <strong>Deadline:</strong> <span className="ml-2">{new Date(job.applicationDeadline).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                      <IoListOutline className="mr-2 text-teal-500" />
                      Description
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{job.description}</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                      <IoListOutline className="mr-2 text-teal-500" />
                      Requirements
                    </h4>
                    <ul className="list-disc pl-6 text-gray-700">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="mb-1">{req}</li>
                      ))}
                    </ul>
                  </div>
                  <motion.button
                    onClick={() => !hasApplied(job._id) ? setApplyJobId(job._id) : null}
                    className={`w-full py-3 rounded-lg shadow-md ${
                      hasApplied(job._id)
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white hover:from-teal-600 hover:to-teal-700"
                    }`}
                    whileHover={!hasApplied(job._id) ? { scale: 1.05 } : {}}
                    whileTap={!hasApplied(job._id) ? { scale: 0.95 } : {}}
                    disabled={loading || hasApplied(job._id)}
                  >
                    {hasApplied(job._id) ? "Already Applied" : "Apply Now"}
                  </motion.button>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Full-Screen Application Form Modal */}
        {applyJobId && (
          <motion.div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Apply to {jobs.find(job => job._id === applyJobId)?.title}</h3>
                <IoClose
                  className="text-gray-600 cursor-pointer hover:text-gray-800"
                  onClick={() => setApplyJobId(null)}
                />
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={applicationData.resumeUrl}
                  onChange={(e) => setApplicationData({ ...applicationData, resumeUrl: e.target.value })}
                  placeholder="Resume URL"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 shadow-sm"
                  required
                />
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                  placeholder="Cover Letter (optional)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 shadow-sm"
                  rows="4"
                />
                <motion.button
                  onClick={() => applyToJob(applyJobId)}
                  className="w-full py-3 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 disabled:bg-gray-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading || !applicationData.resumeUrl}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MenteeDashboard;