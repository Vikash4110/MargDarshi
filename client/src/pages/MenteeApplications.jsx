import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoBriefcaseOutline, IoBusiness, IoLocationSharp, IoListOutline } from "react-icons/io5";

const MenteeApplications = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/auth/jobs/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      setApplications(data.applications);
    } catch (err) {
      toast.error(err.message || "Error loading applications");
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
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-tight flex items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <IoBriefcaseOutline className="mr-2 text-teal-500" />
          My Job Applications
        </motion.h1>

        {loading ? (
          <p className="text-gray-600 text-center">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="text-gray-600 text-center">You haven't applied to any jobs yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <motion.div
                key={application._id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: applications.indexOf(application) * 0.1, duration: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <IoBriefcaseOutline className="mr-2 text-teal-500" />
                  {application.jobId.title}
                </h3>
                <p className="text-gray-600 flex items-center mt-2">
                  <IoBusiness className="mr-2 text-teal-500" />
                  {application.jobId.company}
                </p>
                <p className="text-gray-600 flex items-center">
                  <IoLocationSharp className="mr-2 text-teal-500" />
                  {application.jobId.location}
                </p>
                <p className="text-sm text-gray-500 mt-2">Type: {application.jobId.jobType}</p>
                <p className="text-sm text-gray-500">
                  Applied on: {new Date(application.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Status: <span className={`font-semibold ${application.status === "Pending" ? "text-yellow-500" : application.status === "Accepted" ? "text-green-500" : "text-red-500"}`}>{application.status}</span>
                </p>
                <p className="text-sm text-gray-500">Resume: <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">View</a></p>
                {application.coverLetter && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                      <IoListOutline className="mr-2 text-teal-500" />
                      Cover Letter:
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">{application.coverLetter}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MenteeApplications;