import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IoBriefcaseOutline, IoAddCircleOutline, IoBusinessOutline,IoEyeOutline } from "react-icons/io5";

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
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 p-8 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight flex items-center">
            <IoBriefcaseOutline className="mr-2 text-teal-500" />
            Your Posted Jobs
          </h2>
          <Link to="/post-job">
            <motion.button
              className="py-2 px-4 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoAddCircleOutline className="mr-2" />
              Create a Job Post
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center text-lg">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">You haven't posted any jobs yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: jobs.indexOf(job) * 0.1, duration: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 truncate">{job.title}</h3>
                <p className="text-gray-600 mt-2 flex items-center">
                  <IoBusinessOutline className="mr-2 text-teal-500" />
                  {job.company} - {job.location}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">Type:</span> {job.jobType}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-1 ${job.status === "Open" ? "text-green-500" : "text-red-500"} font-semibold`}>
                    {job.status}
                  </span>
                </p>
                <Link to={`/mentor-job-applicants/${job._id}`}>
                  <motion.button
                    className="mt-4 w-full py-2 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IoEyeOutline className="mr-2" />
                    View Applicants
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostedJobs;