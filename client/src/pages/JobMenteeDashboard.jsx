import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoBriefcaseOutline, IoClose, IoEyeOutline } from "react-icons/io5";

const MenteeDashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null); // For viewing job details
  const [applyJobId, setApplyJobId] = useState(null); // For showing application form
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
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Mentee Dashboard
        </motion.h1>

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
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative"
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
                    className="mt-4 w-full py-2 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 disabled:bg-gray-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    View Job
                  </motion.button>

                  {/* Job Details Popup */}
                  {selectedJobId === job._id && (
                    <motion.div
                      className="absolute top-0 left-0 w-full h-full bg-white p-6 rounded-2xl shadow-xl z-10 overflow-y-auto"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                        <IoClose
                          className="text-gray-600 cursor-pointer hover:text-gray-800"
                          onClick={() => setSelectedJobId(null)}
                        />
                      </div>
                      <div className="space-y-3 text-gray-700">
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Posted by:</strong> {job.mentorId.fullName}</p>
                        <p><strong>Type:</strong> {job.jobType}</p>
                        <p><strong>Salary Range:</strong> {job.salaryRange || "Not specified"}</p>
                        <p><strong>Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                        <p><strong>Description:</strong> {job.description}</p>
                        <p><strong>Requirements:</strong></p>
                        <ul className="list-disc pl-5">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      <motion.button
                        onClick={() => !hasApplied(job._id) ? setApplyJobId(job._id) : null}
                        className={`mt-4 w-full py-2 rounded-lg shadow-md ${
                          hasApplied(job._id)
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white hover:from-teal-600 hover:to-teal-700"
                        }`}
                        whileHover={!hasApplied(job._id) ? { scale: 1.05 } : {}}
                        whileTap={!hasApplied(job._id) ? { scale: 0.95 } : {}}
                        disabled={loading || hasApplied(job._id)}
                      >
                        {hasApplied(job._id) ? "Already Applied" : "Apply"}
                      </motion.button>

                      {/* Application Form Popup */}
                      {applyJobId === job._id && !hasApplied(job._id) && (
                        <motion.div
                          className="absolute top-0 left-0 w-full h-full bg-white p-6 rounded-2xl shadow-xl z-20"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Apply to {job.title}</h3>
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
                              onClick={() => applyToJob(job._id)}
                              className="w-full py-3 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 disabled:bg-gray-400"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={loading || !applicationData.resumeUrl}
                            >
                              {loading ? "Submitting..." : "Submit Application"}
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MenteeDashboard;