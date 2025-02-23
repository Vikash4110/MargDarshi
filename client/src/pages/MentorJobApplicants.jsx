import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IoPeopleOutline, IoEyeOutline, IoMailOutline, IoSchoolOutline, IoBusinessOutline, IoPhonePortraitOutline, IoDocumentTextOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline,IoClose,IoListOutline } from "react-icons/io5";

const MentorJobApplicants = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);

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

  const updateApplicationStatus = async (applicationId, status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/auth/mentor-update-application-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationId, status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      toast.success(`Status updated to ${status}`, { icon: <IoCheckmarkCircleOutline className="text-green-500" /> });
      fetchApplicants();
    } catch (err) {
      toast.error(err.message || "Error updating status", { icon: <IoCloseCircleOutline className="text-red-500" /> });
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
        <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-tight flex items-center justify-center">
          <IoPeopleOutline className="mr-2 text-teal-500" />
          Job Applicants
        </h2>
        {loading && !selectedApplicantId ? (
          <p className="text-gray-600 text-center text-lg">Loading applicants...</p>
        ) : applicants.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No applicants yet for this job.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applicants.map((applicant) => (
              <motion.div
                key={applicant._id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: applicants.indexOf(applicant) * 0.1, duration: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 truncate">{applicant.menteeId.fullName}</h3>
                <p className="text-gray-600 mt-2 flex items-center">
                  <IoMailOutline className="mr-2 text-teal-500" />
                  {applicant.menteeId.email}
                </p>
                <p className="text-gray-600 mt-1">
                  Status: <span className={`font-semibold ${applicant.status === "Pending" ? "text-yellow-500" : applicant.status === "Accepted" ? "text-green-500" : applicant.status === "Rejected" ? "text-red-500" : "text-blue-500"}`}>{applicant.status}</span>
                </p>
                <motion.button
                  onClick={() => setSelectedApplicantId(applicant._id)}
                  className="mt-4 w-full py-2 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  <IoEyeOutline className="mr-2" />
                  View Application
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Full-Screen Applicant Details Modal */}
        {selectedApplicantId && (
          <motion.div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {applicants.filter(applicant => applicant._id === selectedApplicantId).map((applicant) => (
                <div key={applicant._id} className="space-y-6 text-gray-800">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                      <IoPeopleOutline className="mr-2 text-teal-500" />
                      {applicant.menteeId.fullName}
                    </h3>
                    <IoClose
                      className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800"
                      onClick={() => setSelectedApplicantId(null)}
                    />
                  </div>
                  <div className="space-y-4">
                    <p className="flex items-center text-lg">
                      <IoMailOutline className="mr-2 text-teal-500" />
                      <strong>Email:</strong> <span className="ml-2">{applicant.menteeId.email}</span>
                    </p>
                    <p className="flex items-center text-lg">
                      <IoPhonePortraitOutline className="mr-2 text-teal-500" />
                      <strong>Phone:</strong> <span className="ml-2">{applicant.menteeId.phoneNumber || "N/A"}</span>
                    </p>
                    <p className="flex items-center text-lg">
                      <IoSchoolOutline className="mr-2 text-teal-500" />
                      <strong>Education:</strong> <span className="ml-2">{applicant.menteeId.currentEducationLevel || "N/A"}</span>
                    </p>
                    <p className="flex items-center text-lg">
                      <IoBusinessOutline className="mr-2 text-teal-500" />
                      <strong>University:</strong> <span className="ml-2">{applicant.menteeId.universityName || "N/A"}</span>
                    </p>
                    <p className="flex items-center text-lg">
                      <IoListOutline className="mr-2 text-teal-500" />
                      <strong>Field:</strong> <span className="ml-2">{applicant.menteeId.fieldOfStudy || "N/A"}</span>
                    </p>
                    <p className="flex items-center text-lg">
                      <IoDocumentTextOutline className="mr-2 text-teal-500" />
                      <strong>Resume:</strong> <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-teal-500 hover:underline">View Resume</a>
                    </p>
                    {applicant.coverLetter && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                          <IoListOutline className="mr-2 text-teal-500" />
                          Cover Letter
                        </h4>
                        <p className="text-gray-700 mt-2 leading-relaxed">{applicant.coverLetter}</p>
                      </div>
                    )}
                    <div className="mt-6">
                      <label className="block text-lg font-medium text-gray-800 mb-2 flex items-center">
                        <IoCheckmarkCircleOutline className="mr-2 text-teal-500" />
                        Update Application Status
                      </label>
                      <select
                        value={applicant.status}
                        onChange={(e) => updateApplicationStatus(applicant._id, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 shadow-sm text-gray-700 bg-gray-50"
                        disabled={loading}
                      >
                        <option value="Pending" className="text-yellow-500">Pending</option>
                        <option value="Reviewed" className="text-blue-500">Reviewed</option>
                        <option value="Accepted" className="text-green-500">Accepted</option>
                        <option value="Rejected" className="text-red-500">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MentorJobApplicants;