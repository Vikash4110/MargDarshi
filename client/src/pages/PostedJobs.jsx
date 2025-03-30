// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { IoBriefcaseOutline, IoAddCircleOutline, IoBusinessOutline,IoEyeOutline } from "react-icons/io5";

// const PostedJobs = () => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchPostedJobs();
//   }, []);

//   const fetchPostedJobs = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${backendUrl}/api/auth/mentor-posted-jobs`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error("Failed to fetch jobs");
//       const data = await response.json();
//       setJobs(data.jobs);
//     } catch (err) {
//       toast.error(err.message || "Error loading posted jobs");
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
//         <div className="flex justify-between items-center mb-10">
//           <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight flex items-center">
//             <IoBriefcaseOutline className="mr-2 text-teal-500" />
//             Your Posted Jobs
//           </h2>
//           <Link to="/post-job">
//             <motion.button
//               className="py-2 px-4 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 flex items-center"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <IoAddCircleOutline className="mr-2" />
//               Create a Job Post
//             </motion.button>
//           </Link>
//         </div>

//         {loading ? (
//           <p className="text-gray-600 text-center text-lg">Loading jobs...</p>
//         ) : jobs.length === 0 ? (
//           <p className="text-gray-600 text-center text-lg">You haven't posted any jobs yet.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {jobs.map((job) => (
//               <motion.div
//                 key={job._id}
//                 className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: jobs.indexOf(job) * 0.1, duration: 0.4 }}
//               >
//                 <h3 className="text-xl font-semibold text-gray-800 truncate">{job.title}</h3>
//                 <p className="text-gray-600 mt-2 flex items-center">
//                   <IoBusinessOutline className="mr-2 text-teal-500" />
//                   {job.company} - {job.location}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-2">
//                   <span className="font-medium">Type:</span> {job.jobType}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   <span className="font-medium">Status:</span> 
//                   <span className={`ml-1 ${job.status === "Open" ? "text-green-500" : "text-red-500"} font-semibold`}>
//                     {job.status}
//                   </span>
//                 </p>
//                 <Link to={`/mentor-job-applicants/${job._id}`}>
//                   <motion.button
//                     className="mt-4 w-full py-2 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 flex items-center justify-center"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <IoEyeOutline className="mr-2" />
//                     View Applicants
//                   </motion.button>
//                 </Link>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default PostedJobs;

// THIS IS THE PREVIOUS CODE THAT IS WORKING SUCCESFULLY BUT THE NEW CODE IS GENERATE UNABLE TO FETCH THE ERROR 

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  IoBriefcaseOutline, 
  IoAddCircleOutline, 
  IoEyeOutline,
  IoTimeOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoBusinessOutline,
  IoLocationOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoCalendarOutline,
  IoPeopleOutline
} from "react-icons/io5";

const statusBadgeStyles = {
  Open: "bg-green-100 text-green-800",
  Closed: "bg-red-100 text-red-800",
  Draft: "bg-yellow-100 text-yellow-800"
};

const statusIcons = {
  Open: <IoCheckmarkOutline className="text-green-500" />,
  Closed: <IoCloseOutline className="text-red-500" />,
  Draft: <IoTimeOutline className="text-yellow-500" />
};

const PostedJobs = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");

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
      
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      
      const data = await response.json();
      setJobs(data.jobs);
    } catch (err) {
      toast.error(err.message || "Error loading posted jobs");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <IoBriefcaseOutline className="text-teal-600 mr-3" />
              Your Posted Jobs
            </motion.h1>
            <motion.p 
              className="text-gray-600 mt-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Manage and track your posted mentorship opportunities
            </motion.p>
          </div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/post-job">
              <motion.button
                className="flex items-center px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-lg hover:from-teal-700 hover:to-teal-600 transition-all duration-300"
                whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(5, 150, 140, 0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                <IoAddCircleOutline className="mr-2 text-lg" />
                <span className="font-medium">Create New Job</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { 
              title: "Total Jobs Posted", 
              value: jobs.length, 
              icon: <IoBriefcaseOutline className="text-xl" />,
              bg: "bg-teal-50",
              color: "text-teal-600"
            },
            { 
              title: "Active Jobs", 
              value: jobs.filter(job => job.status === "Open").length,
              icon: <IoCheckmarkOutline className="text-xl" />,
              bg: "bg-green-50",
              color: "text-green-600"
            },
            { 
              title: "Closed Jobs", 
              value: jobs.filter(job => job.status === "Closed").length,
              icon: <IoCloseOutline className="text-xl" />,
              bg: "bg-red-50",
              color: "text-red-600"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoSearchOutline className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoFilterOutline className="text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm bg-white text-gray-700 appearance-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoCalendarOutline className="text-gray-400" />
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm bg-white text-gray-700 appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </div>
        ) : sortedJobs.length === 0 ? (
          <motion.div
            className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <IoBriefcaseOutline className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchTerm || statusFilter !== "All" ? "No matching jobs found" : "No jobs posted yet"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm || statusFilter !== "All" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first mentorship opportunity"}
            </p>
            <Link to="/post-job">
              <motion.button
                className="flex items-center px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-lg hover:from-teal-700 hover:to-teal-600 transition-all duration-300 mx-auto"
                whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(5, 150, 140, 0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                <IoAddCircleOutline className="mr-2" />
                Post a Job
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-5 md:col-span-3">Position</div>
              <div className="col-span-3 hidden md:block">Company</div>
              <div className="col-span-2 hidden md:block">Location</div>
              <div className="col-span-2 hidden md:block">Posted</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 md:col-span-1 text-right">Actions</div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              <AnimatePresence>
                {sortedJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="col-span-5 md:col-span-3">
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <IoBriefcaseOutline className="mr-1.5 text-teal-500" size={14} />
                        {job.jobType}
                      </p>
                    </div>
                    
                    <div className="col-span-3 hidden md:block">
                      <p className="text-gray-900 flex items-center">
                        <IoBusinessOutline className="mr-1.5 text-teal-500" size={14} />
                        {job.company}
                      </p>
                    </div>
                    
                    <div className="col-span-2 hidden md:block">
                      <p className="text-gray-900 flex items-center">
                        <IoLocationOutline className="mr-1.5 text-teal-500" size={14} />
                        {job.location}
                      </p>
                    </div>
                    
                    <div className="col-span-2 hidden md:block">
                      <p className="text-gray-500 text-sm flex items-center">
                        <IoCalendarOutline className="mr-1.5 text-teal-500" size={14} />
                        {formatDate(job.createdAt)}
                      </p>
                    </div>
                    
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadgeStyles[job.status]}`}>
                        {statusIcons[job.status]}
                        <span className="ml-1">{job.status}</span>
                      </span>
                    </div>
                    
                    <div className="col-span-2 md:col-span-1 flex justify-end">
                      <Link to={`/mentor-job-applicants/${job._id}`}>
                        <motion.button
                          className="flex items-center px-3 py-1.5 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors group"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IoEyeOutline className="mr-1 group-hover:text-teal-700" size={16} />
                          <span className="text-sm font-medium">View</span>
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PostedJobs;