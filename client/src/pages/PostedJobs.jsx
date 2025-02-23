import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IoBriefcaseOutline } from "react-icons/io5";

const PostedJobs = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  const fetchPostedJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/auth/mentor-posted-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      setJobs(data.jobs);
    } catch (err) {
      toast.error(err.message || "Error loading posted jobs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <IoBriefcaseOutline className="mr-2 text-teal-500" />
        Your Posted Jobs
      </h2>
      {loading ? (
        <p className="text-gray-600 text-center">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-600 text-center">You haven't posted any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <p className="text-sm text-gray-500 mt-2">Type: {job.jobType}</p>
              <p className="text-sm text-gray-500">Status: {job.status}</p>
              <Link to={`/mentor-job-applicants/${job._id}`}>
                <motion.button
                  className="mt-4 w-full py-2 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Applicants
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PostedJobs;