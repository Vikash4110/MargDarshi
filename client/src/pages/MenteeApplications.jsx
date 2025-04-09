import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { 
  IoBriefcaseOutline, 
  IoBusiness, 
  IoLocationSharp, 
  IoListOutline,
  IoTimeOutline,
  IoDocumentTextOutline,
  IoChevronDownOutline,
  IoChevronUpOutline
} from "react-icons/io5";
import { FiFilter, FiSearch } from "react-icons/fi";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Interview: "bg-blue-100 text-blue-800"
};

const MenteeApplications = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedCard, setExpandedCard] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchTerm, statusFilter, sortBy]);

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

  const filterAndSortApplications = () => {
    let result = [...applications];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(app => 
        app.jobId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobId.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== "All") {
      result = result.filter(app => app.status === statusFilter);
    }
    
    // Sort applications
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
    
    setFilteredApplications(result);
  };

  const toggleExpandCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length;
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 tracking-tight">
            My Job Applications
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track all your job applications in one place. Monitor your progress and stay organized.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="bg-white p-4 rounded-xl shadow-sm mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search applications..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <div className="flex items-center">
                <FiFilter className="text-gray-500 mr-2" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Interview">Interview</option>
                </select>
              </div>
              
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
          
          {/* Status Quick Stats */}
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
              Total: {applications.length}
            </div>
            <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">
              Pending: {getStatusCount("Pending")}
            </div>
            <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
              Accepted: {getStatusCount("Accepted")}
            </div>
            <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
              Interview: {getStatusCount("Interview")}
            </div>
            <div className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm">
              Rejected: {getStatusCount("Rejected")}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <IoBriefcaseOutline className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {applications.length === 0 
                ? "You haven't applied to any jobs yet" 
                : "No applications match your filters"}
            </h3>
            <p className="text-gray-500">
              {applications.length === 0 
                ? "Start applying to jobs to see them appear here" 
                : "Try adjusting your search or filters"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredApplications.map((application) => (
                <motion.div
                  key={application._id}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {application.jobId.title}
                      </h3>
                      <p className="text-gray-600 text-sm flex items-center mt-1">
                        <IoBusiness className="mr-2 text-blue-500" />
                        {application.jobId.company}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
                      {application.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-600 text-sm flex items-center">
                      <IoLocationSharp className="mr-2 text-blue-500" />
                      {application.jobId.location}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center">
                      <IoTimeOutline className="mr-2 text-blue-500" />
                      Applied: {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center">
                      <IoDocumentTextOutline className="mr-2 text-blue-500" />
                      <a 
                        href={application.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    </p>
                  </div>
                  
                  <AnimatePresence>
                    {expandedCard === application._id && (
                      <motion.div
                        className="mt-4 pt-4 border-t border-gray-100"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Job Details
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          Type: {application.jobId.jobType}
                        </p>
                        <p className="text-gray-600 text-sm mb-2">
                          Salary: {application.jobId.salary || "Not specified"}
                        </p>
                        
                        {application.coverLetter && (
                          <>
                            <h4 className="text-sm font-medium text-gray-700 mt-3 mb-2">
                              Cover Letter
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {application.coverLetter}
                            </p>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button
                    onClick={() => toggleExpandCard(application._id)}
                    className="mt-4 text-blue-600 text-sm font-medium flex items-center justify-center hover:text-blue-800 transition-colors"
                  >
                    {expandedCard === application._id ? (
                      <>
                        <IoChevronUpOutline className="mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <IoChevronDownOutline className="mr-1" />
                        Show More
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MenteeApplications;