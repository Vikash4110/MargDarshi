import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  IoBriefcaseOutline,
  IoClose,
  IoPerson,
  IoCashOutline,
  IoCalendarOutline,
  IoPaperPlaneOutline,
  IoTimeOutline,
  IoSearchOutline,
  IoGlobe
} from "react-icons/io5";
import { FaLinkedin, FaGithub, FaRegFilePdf } from "react-icons/fa";

const MenteeDashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [applicationData, setApplicationData] = useState({ 
    resumeUrl: "", 
    coverLetter: "",
    linkedInUrl: "",
    githubUrl: "",
    portfolioUrl: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      const response = await fetch(`${backendUrl}/api/auth/jobs/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.jobs) {
        throw new Error("Invalid jobs data received");
      }
      
      setJobs(data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error(err.message || "Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      const response = await fetch(`${backendUrl}/api/auth/jobs/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }
      
      const data = await response.json();
      if (!Array.isArray(data.applications)) {
        throw new Error("Invalid applications data received");
      }
      
      setApplications(data.applications.map(app => app.jobId?._id).filter(Boolean));
    } catch (err) {
      console.error("Error fetching applications:", err);
      toast.error(err.message || "Error loading applications");
    }
  };

  const applyToJob = async (jobId) => {
    if (!jobId) {
      toast.error("No job selected for application");
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      if (!applicationData.resumeUrl) {
        throw new Error("Resume URL is required");
      }
      
      const response = await fetch(`${backendUrl}/api/auth/jobs/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId, ...applicationData }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit application");
      }
      
      toast.success("Application submitted successfully!");
      setSelectedJob(null);
      setApplicationData({ 
        resumeUrl: "", 
        coverLetter: "",
        linkedInUrl: "",
        githubUrl: "",
        portfolioUrl: ""
      });
      
      // Refresh data
      await Promise.all([fetchJobs(), fetchApplications()]);
    } catch (err) {
      console.error("Error applying to job:", err);
      toast.error(err.message || "Error applying to job");
    } finally {
      setLoading(false);
    }
  };

  const hasApplied = (jobId) => {
    if (!jobId || !Array.isArray(applications)) return false;
    return applications.includes(jobId);
  };

  const filteredJobs = jobs.filter(job => {
    if (!job || !job.title || !job.company) return false;
    
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "applied" && hasApplied(job._id)) || 
                         (filter === "notApplied" && !hasApplied(job._id));
    
    return matchesSearch && matchesFilter;
  });

  const jobTypes = [...new Set(jobs.map(job => job.jobType).filter(Boolean))];

  const handleOpenModal = (job) => {
    if (!job || !job._id) {
      toast.error("Invalid job data");
      return;
    }
    
    setModalLoading(true);
    setSelectedJob(job);
    setApplicationData({ 
      resumeUrl: "", 
      coverLetter: "",
      linkedInUrl: "",
      githubUrl: "",
      portfolioUrl: ""
    });
    
    // Small timeout to ensure state is updated before showing content
    setTimeout(() => setModalLoading(false), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Mentee Dashboard
              </h1>
              <p className="mt-1 text-gray-600">
                Find and apply to job opportunities from mentors
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link to="/mentee-applications">
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <IoPaperPlaneOutline className="mr-2" />
                  View Applications
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoSearchOutline className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 pr-12 py-3 border-gray-300 rounded-md"
                  placeholder="Search jobs or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <select
                className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-3 pr-10 py-3 text-base border-gray-300 rounded-md"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Jobs</option>
                <option value="applied">Applied</option>
                <option value="notApplied">Not Applied</option>
              </select>
              
              <select
                className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-3 pr-10 py-3 text-base border-gray-300 rounded-md"
                onChange={(e) => setFilter(e.target.value === "all" ? "all" : e.target.value)}
              >
                <option value="all">All Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job Opportunities */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{job.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {job.company} • {job.location}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hasApplied(job._id) 
                            ? "bg-green-100 text-green-800" 
                            : "bg-teal-100 text-teal-800"
                        }`}>
                          {hasApplied(job._id) ? "Applied" : job.jobType}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <IoPerson className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span>Posted by {job.mentorId?.fullName || "Unknown"}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <IoCalendarOutline className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span>Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "Not specified"}</span>
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <button
                        onClick={() => handleOpenModal(job)}
                        className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          hasApplied(job._id)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-teal-600 hover:bg-teal-700"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                        disabled={hasApplied(job._id)}
                      >
                        {hasApplied(job._id) ? "Already Applied" : "View & Apply"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Job Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black opacity-50" />

          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {modalLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl leading-6 font-bold text-gray-900">
                            {selectedJob.title}
                          </h3>
                          <p className="mt-1 text-lg text-gray-600">
                            {selectedJob.company} • {selectedJob.location}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedJob(null)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <IoClose className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <IoPerson className="h-5 w-5 text-teal-500 mr-2" />
                          <span className="text-gray-700">
                            <strong>Posted by:</strong> {selectedJob.mentorId?.fullName || "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <IoBriefcaseOutline className="h-5 w-5 text-teal-500 mr-2" />
                          <span className="text-gray-700">
                            <strong>Type:</strong> {selectedJob.jobType}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <IoCashOutline className="h-5 w-5 text-teal-500 mr-2" />
                          <span className="text-gray-700">
                            <strong>Salary:</strong> {selectedJob.salaryRange || "Not specified"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <IoTimeOutline className="h-5 w-5 text-teal-500 mr-2" />
                          <span className="text-gray-700">
                            <strong>Deadline:</strong> {selectedJob.applicationDeadline ? new Date(selectedJob.applicationDeadline).toLocaleDateString() : "Not specified"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Job Description
                        </h4>
                        <p className="text-gray-700 whitespace-pre-line">
                          {selectedJob.description || "No description provided"}
                        </p>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Requirements
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                          {selectedJob.requirements?.length > 0 ? (
                            selectedJob.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))
                          ) : (
                            <li>No specific requirements listed</li>
                          )}
                        </ul>
                      </div>

                      {!hasApplied(selectedJob._id) && (
                        <div className="mt-8 border-t border-gray-200 pt-6">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">
                            Application Details
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700">
                                Resume URL *
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <FaRegFilePdf className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  id="resumeUrl"
                                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                  placeholder="https://example.com/resume.pdf"
                                  value={applicationData.resumeUrl}
                                  onChange={(e) => setApplicationData({...applicationData, resumeUrl: e.target.value})}
                                  required
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor="linkedInUrl" className="block text-sm font-medium text-gray-700">
                                LinkedIn Profile
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <FaLinkedin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  id="linkedInUrl"
                                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                  placeholder="https://linkedin.com/in/yourprofile"
                                  value={applicationData.linkedInUrl}
                                  onChange={(e) => setApplicationData({...applicationData, linkedInUrl: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
                                GitHub Profile
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <FaGithub className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  id="githubUrl"
                                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                  placeholder="https://github.com/yourusername"
                                  value={applicationData.githubUrl}
                                  onChange={(e) => setApplicationData({...applicationData, githubUrl: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700">
                                Portfolio Website
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <IoGlobe className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  id="portfolioUrl"
                                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                  placeholder="https://yourportfolio.com"
                                  value={applicationData.portfolioUrl}
                                  onChange={(e) => setApplicationData({...applicationData, portfolioUrl: e.target.value})}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                              Cover Letter
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="coverLetter"
                                rows={6}
                                className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                placeholder="Write a brief cover letter explaining why you're a good fit for this position..."
                                value={applicationData.coverLetter}
                                onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <button
                              type="button"
                              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 mr-3"
                              onClick={() => setSelectedJob(null)}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                              onClick={() => applyToJob(selectedJob._id)}
                              disabled={!applicationData.resumeUrl || loading}
                            >
                              {loading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Processing...
                                </>
                              ) : "Submit Application"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeDashboard;