import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IoPeopleOutline } from "react-icons/io5";

const MentorJobApplicants = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { jobId } = useParams(); // Assuming jobId is passed via URL
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/auth/mentor-job-applicants/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch applicants");
      const data = await response.json();
      setApplicants(data.applicants);
    } catch (err) {
      toast.error(err.message || "Error loading applicants");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <IoPeopleOutline className="mr-2 text-teal-500" />
        Job Applicants
      </h2>
      {loading ? (
        <p className="text-gray-600 text-center">Loading applicants...</p>
      ) : applicants.length === 0 ? (
        <p className="text-gray-600 text-center">No applicants yet for this job.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applicants.map((applicant) => (
            <motion.div
              key={applicant._id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: applicants.indexOf(applicant) * 0.1, duration: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-gray-800">{applicant.menteeId.fullName}</h3>
              <p className="text-gray-600">Email: {applicant.menteeId.email}</p>
              <p className="text-gray-600">Phone: {applicant.menteeId.phoneNumber || "N/A"}</p>
              <p className="text-gray-600">Education: {applicant.menteeId.currentEducationLevel || "N/A"}</p>
              <p className="text-gray-600">University: {applicant.menteeId.universityName || "N/A"}</p>
              <p className="text-gray-600">Field: {applicant.menteeId.fieldOfStudy || "N/A"}</p>
              <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">View Resume</a>
              {applicant.coverLetter && (
                <p className="text-gray-600 mt-2">Cover Letter: {applicant.coverLetter}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MentorJobApplicants;