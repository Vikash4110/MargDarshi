// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { IoPeopleOutline, IoEyeOutline, IoMailOutline, IoSchoolOutline, IoBusinessOutline, IoPhonePortraitOutline, IoDocumentTextOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline,IoClose,IoListOutline } from "react-icons/io5";

// const MentorJobApplicants = () => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const { jobId } = useParams();
//   const [applicants, setApplicants] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedApplicantId, setSelectedApplicantId] = useState(null);

//   useEffect(() => {
//     fetchApplicants();
//   }, [jobId]);

//   const fetchApplicants = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${backendUrl}/api/auth/mentor-job-applicants/${jobId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error("Failed to fetch applicants");
//       const data = await response.json();
//       setApplicants(data.applicants);
//     } catch (err) {
//       toast.error(err.message || "Error loading applicants");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateApplicationStatus = async (applicationId, status) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${backendUrl}/api/auth/mentor-update-application-status`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ applicationId, status }),
//       });
//       if (!response.ok) throw new Error("Failed to update status");
//       toast.success(`Status updated to ${status}`, { icon: <IoCheckmarkCircleOutline className="text-green-500" /> });
//       fetchApplicants();
//     } catch (err) {
//       toast.error(err.message || "Error updating status", { icon: <IoCloseCircleOutline className="text-red-500" /> });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 p-8 overflow-hidden"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.8 }}
//     >
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-tight flex items-center justify-center">
//           <IoPeopleOutline className="mr-2 text-teal-500" />
//           Job Applicants
//         </h2>
//         {loading && !selectedApplicantId ? (
//           <p className="text-gray-600 text-center text-lg">Loading applicants...</p>
//         ) : applicants.length === 0 ? (
//           <p className="text-gray-600 text-center text-lg">No applicants yet for this job.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {applicants.map((applicant) => (
//               <motion.div
//                 key={applicant._id}
//                 className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: applicants.indexOf(applicant) * 0.1, duration: 0.4 }}
//               >
//                 <h3 className="text-xl font-semibold text-gray-800 truncate">{applicant.menteeId.fullName}</h3>
//                 <p className="text-gray-600 mt-2 flex items-center">
//                   <IoMailOutline className="mr-2 text-teal-500" />
//                   {applicant.menteeId.email}
//                 </p>
//                 <p className="text-gray-600 mt-1">
//                   Status: <span className={`font-semibold ${applicant.status === "Pending" ? "text-yellow-500" : applicant.status === "Accepted" ? "text-green-500" : applicant.status === "Rejected" ? "text-red-500" : "text-blue-500"}`}>{applicant.status}</span>
//                 </p>
//                 <motion.button
//                   onClick={() => setSelectedApplicantId(applicant._id)}
//                   className="mt-4 w-full py-2 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 flex items-center justify-center"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   disabled={loading}
//                 >
//                   <IoEyeOutline className="mr-2" />
//                   View Application
//                 </motion.button>
//               </motion.div>
//             ))}
//           </div>
//         )}

//         {/* Full-Screen Applicant Details Modal */}
//         {selectedApplicantId && (
//           <motion.div
//             className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto border border-gray-100"
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               transition={{ duration: 0.3 }}
//             >
//               {applicants.filter(applicant => applicant._id === selectedApplicantId).map((applicant) => (
//                 <div key={applicant._id} className="space-y-6 text-gray-800">
//                   <div className="flex justify-between items-center border-b pb-4">
//                     <h3 className="text-2xl font-bold text-gray-800 flex items-center">
//                       <IoPeopleOutline className="mr-2 text-teal-500" />
//                       {applicant.menteeId.fullName}
//                     </h3>
//                     <IoClose
//                       className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800"
//                       onClick={() => setSelectedApplicantId(null)}
//                     />
//                   </div>
//                   <div className="space-y-4">
//                     <p className="flex items-center text-lg">
//                       <IoMailOutline className="mr-2 text-teal-500" />
//                       <strong>Email:</strong> <span className="ml-2">{applicant.menteeId.email}</span>
//                     </p>
//                     <p className="flex items-center text-lg">
//                       <IoPhonePortraitOutline className="mr-2 text-teal-500" />
//                       <strong>Phone:</strong> <span className="ml-2">{applicant.menteeId.phoneNumber || "N/A"}</span>
//                     </p>
//                     <p className="flex items-center text-lg">
//                       <IoSchoolOutline className="mr-2 text-teal-500" />
//                       <strong>Education:</strong> <span className="ml-2">{applicant.menteeId.currentEducationLevel || "N/A"}</span>
//                     </p>
//                     <p className="flex items-center text-lg">
//                       <IoBusinessOutline className="mr-2 text-teal-500" />
//                       <strong>University:</strong> <span className="ml-2">{applicant.menteeId.universityName || "N/A"}</span>
//                     </p>
//                     <p className="flex items-center text-lg">
//                       <IoListOutline className="mr-2 text-teal-500" />
//                       <strong>Field:</strong> <span className="ml-2">{applicant.menteeId.fieldOfStudy || "N/A"}</span>
//                     </p>
//                     <p className="flex items-center text-lg">
//                       <IoDocumentTextOutline className="mr-2 text-teal-500" />
//                       <strong>Resume:</strong> <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-teal-500 hover:underline">View Resume</a>
//                     </p>
//                     {applicant.coverLetter && (
//                       <div>
//                         <h4 className="text-lg font-semibold text-gray-800 flex items-center">
//                           <IoListOutline className="mr-2 text-teal-500" />
//                           Cover Letter
//                         </h4>
//                         <p className="text-gray-700 mt-2 leading-relaxed">{applicant.coverLetter}</p>
//                       </div>
//                     )}
//                     <div className="mt-6">
//                       <label className="block text-lg font-medium text-gray-800 mb-2 flex items-center">
//                         <IoCheckmarkCircleOutline className="mr-2 text-teal-500" />
//                         Update Application Status
//                       </label>
//                       <select
//                         value={applicant.status}
//                         onChange={(e) => updateApplicationStatus(applicant._id, e.target.value)}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 shadow-sm text-gray-700 bg-gray-50"
//                         disabled={loading}
//                       >
//                         <option value="Pending" className="text-yellow-500">Pending</option>
//                         <option value="Reviewed" className="text-blue-500">Reviewed</option>
//                         <option value="Accepted" className="text-green-500">Accepted</option>
//                         <option value="Rejected" className="text-red-500">Rejected</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </motion.div>
//           </motion.div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default MentorJobApplicants;

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  IoPeopleOutline, 
  IoEyeOutline, 
  IoMailOutline, 
  IoSchoolOutline, 
  IoBusinessOutline, 
  IoPhonePortraitOutline, 
  IoDocumentTextOutline, 
  IoCheckmarkCircleOutline, 
  IoCloseCircleOutline,
  IoClose,
  IoListOutline,
  IoTimeOutline,
  IoCheckmarkOutline,
  IoChevronForwardOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoStatsChartOutline
} from "react-icons/io5";
import { FiUser, FiBriefcase, FiAward } from "react-icons/fi";
import { RiSuitcaseLine, RiGraduationCapLine } from "react-icons/ri";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Reviewed: "bg-blue-100 text-blue-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800"
};

const statusIcons = {
  Pending: <IoTimeOutline className="text-yellow-500" />,
  Reviewed: <IoEyeOutline className="text-blue-500" />,
  Accepted: <IoCheckmarkOutline className="text-green-500" />,
  Rejected: <IoCloseCircleOutline className="text-red-500" />
};

const MentorJobApplicants = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    fetchApplicants();
    fetchJobTitle();
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

  const fetchJobTitle = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/auth/job-title/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch job title");
      const data = await response.json();
      setJobTitle(data.title);
    } catch (err) {
      console.error("Error fetching job title:", err);
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
      toast.success(`Status updated to ${status}`, { 
        icon: <IoCheckmarkCircleOutline className="text-green-500" />,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      fetchApplicants();
    } catch (err) {
      toast.error(err.message || "Error updating status", { 
        icon: <IoCloseCircleOutline className="text-red-500" />,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.menteeId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         applicant.menteeId.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
              <RiSuitcaseLine className="text-teal-600 mr-3" />
              Applicants for: {jobTitle}
            </h1>
            <p className="text-gray-600 mt-2">
              Review and manage applicants for this mentorship position
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoSearchOutline className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search applicants..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm bg-white text-gray-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-teal-50 text-teal-600 mr-4">
                <IoPeopleOutline className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Applicants</p>
                <p className="text-2xl font-semibold text-gray-800">{applicants.length}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600 mr-4">
                <IoTimeOutline className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {applicants.filter(a => a.status === "Pending").length}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
                <IoEyeOutline className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Reviewed</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {applicants.filter(a => a.status === "Reviewed").length}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4">
                <IoCheckmarkOutline className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Accepted</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {applicants.filter(a => a.status === "Accepted").length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Applicants List */}
        {loading && !selectedApplicantId ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiUser className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No applicants found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || statusFilter !== "All" 
                ? "Try adjusting your search or filter criteria"
                : "No one has applied to this position yet. Check back later."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-5 md:col-span-4">Applicant</div>
              <div className="col-span-3 md:col-span-2">Education</div>
              <div className="col-span-2 hidden md:block">University</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 md:col-span-1 text-right">Action</div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredApplicants.map((applicant) => (
                <motion.div
                  key={applicant._id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="col-span-5 md:col-span-4 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium mr-3">
                      {applicant.menteeId.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{applicant.menteeId.fullName}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <IoMailOutline className="mr-1" size={14} />
                        {applicant.menteeId.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-span-3 md:col-span-2">
                    <p className="text-gray-900">{applicant.menteeId.currentEducationLevel || "-"}</p>
                    <p className="text-sm text-gray-500">{applicant.menteeId.fieldOfStudy || "-"}</p>
                  </div>
                  
                  <div className="col-span-2 hidden md:block">
                    <p className="text-gray-900 truncate">{applicant.menteeId.universityName || "-"}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[applicant.status]}`}>
                      {statusIcons[applicant.status]}
                      <span className="ml-1">{applicant.status}</span>
                    </span>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1 flex justify-end">
                    <motion.button
                      onClick={() => setSelectedApplicantId(applicant._id)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-teal-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IoChevronForwardOutline />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Applicant Details Modal */}
        <AnimatePresence>
          {selectedApplicantId && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                {applicants.filter(applicant => applicant._id === selectedApplicantId).map((applicant) => (
                  <div key={applicant._id} className="overflow-y-auto">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium text-xl mr-4">
                          {applicant.menteeId.fullName.charAt(0)}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{applicant.menteeId.fullName}</h2>
                          <p className="text-gray-600 flex items-center">
                            <IoMailOutline className="mr-1" size={16} />
                            {applicant.menteeId.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedApplicantId(null)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <IoClose size={24} />
                      </button>
                    </div>
                    
                    {/* Modal Body */}
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="bg-gray-50 p-5 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FiUser className="text-teal-600 mr-2" />
                            Personal Information
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="text-gray-800">{applicant.menteeId.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="text-gray-800">{applicant.menteeId.phoneNumber || "Not provided"}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Education Info */}
                        <div className="bg-gray-50 p-5 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <RiGraduationCapLine className="text-teal-600 mr-2" />
                            Education
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-500">Education Level</p>
                              <p className="text-gray-800">{applicant.menteeId.currentEducationLevel || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">University</p>
                              <p className="text-gray-800">{applicant.menteeId.universityName || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Field of Study</p>
                              <p className="text-gray-800">{applicant.menteeId.fieldOfStudy || "Not provided"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Application Details */}
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <FiBriefcase className="text-teal-600 mr-2" />
                          Application Details
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-500">Application Status</p>
                              <div className="flex items-center mt-1">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[applicant.status]}`}>
                                  {statusIcons[applicant.status]}
                                  <span className="ml-1">{applicant.status}</span>
                                </span>
                              </div>
                            </div>
                            <select
                              value={applicant.status}
                              onChange={(e) => updateApplicationStatus(applicant._id, e.target.value)}
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm bg-white text-gray-700"
                              disabled={loading}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Reviewed">Reviewed</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Resume</p>
                            {applicant.resumeUrl ? (
                              <a 
                                href={applicant.resumeUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-teal-600 hover:text-teal-800 hover:underline mt-1"
                              >
                                <IoDocumentTextOutline className="mr-1" />
                                View Resume
                              </a>
                            ) : (
                              <p className="text-gray-500">No resume uploaded</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Cover Letter */}
                      {applicant.coverLetter && (
                        <div className="bg-gray-50 p-5 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FiAward className="text-teal-600 mr-2" />
                            Cover Letter
                          </h3>
                          <div className="prose max-w-none text-gray-700">
                            {applicant.coverLetter.split('\n').map((paragraph, i) => (
                              <p key={i} className="mb-3">{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Modal Footer */}
                    <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 sticky bottom-0 bg-white">
                      <button
                        onClick={() => setSelectedApplicantId(null)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      <a 
                        href={`mailto:${applicant.menteeId.email}`}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                      >
                        <IoMailOutline className="mr-2" />
                        Contact Applicant
                      </a>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MentorJobApplicants;