import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaGithub, FaGlobe, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import { IoBriefcase, IoPerson, IoCode, IoChatbubbles, IoTime, IoRibbon } from "react-icons/io5";
import { SiCalendly } from "react-icons/si";
import { Link } from "react-router-dom";
import MentorAvailabilityChart from "../Components/Loader";

const MentorUser = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { authorizationToken } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/auth/mentor-user`, {
          method: "GET",
          headers: {
            Authorization: authorizationToken,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch mentor details");
        
        const data = await response.json();
        setMentor(data);
      } catch (err) {
        console.error("Error fetching mentor details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">No mentor data available</h2>
        <p className="mt-2 text-gray-500">Please complete your mentor profile</p>
        <Link 
          to="/mentor-update" 
          className="mt-4 inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          Complete Profile
        </Link>
      </div>
    );
  }

  // Calculate rating percentage (example)
  const ratingPercentage = mentor.rating ? (mentor.rating / 5) * 100 : 80;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="md:flex">
            {/* Profile Picture & Basic Info */}
            <div className="md:w-1/3 p-8 bg-gradient-to-b from-teal-50 to-white">
              <div className="flex flex-col items-center">
                <motion.img
                  src={mentor.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg"}
                  alt={mentor.fullName}
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                
                <h1 className="mt-6 text-2xl font-bold text-gray-900">{mentor.fullName}</h1>
                <p className="text-teal-600 font-medium">{mentor.jobTitle || "Professional Mentor"}</p>
                <p className="text-gray-500 mt-1">{mentor.company || "Self-employed"}</p>
                
                {/* Rating */}
                <div className="mt-4 flex items-center">
                  <div className="relative">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div
                      className="absolute top-0 left-0 flex overflow-hidden"
                      style={{ width: `${ratingPercentage}%` }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="ml-2 text-gray-600 text-sm">({mentor.rating || "4.8"})</span>
                </div>
                
                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-teal-600">{mentor.sessionsCompleted || 42}</p>
                    <p className="text-xs text-gray-500">Sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-teal-600">{mentor.yearsOfExperience || 5}+</p>
                    <p className="text-xs text-gray-500">Years Exp</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-teal-600">{mentor.mentees || 18}</p>
                    <p className="text-xs text-gray-500">Mentees</p>
                  </div>
                </div>
                
                {/* Contact & Social */}
                <div className="mt-8 w-full">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Connect</h3>
                  <div className="mt-3 space-y-2">
                    {mentor.email && (
                      <div className="flex items-center text-gray-600">
                        <FaEnvelope className="mr-2 text-teal-500" />
                        <a href={`mailto:${mentor.email}`} className="hover:text-teal-600">{mentor.email}</a>
                      </div>
                    )}
                    
                    {mentor.website && (
                      <div className="flex items-center text-gray-600">
                        <FaGlobe className="mr-2 text-teal-500" />
                        <a href={mentor.website} target="_blank" rel="noopener" className="hover:text-teal-600">
                          {mentor.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    
                    {mentor.calendlyLink && (
                      <div className="flex items-center text-gray-600">
                        <SiCalendly className="mr-2 text-teal-500" />
                        <a href={mentor.calendlyLink} target="_blank" rel="noopener" className="hover:text-teal-600">
                          Schedule Session
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex space-x-4">
                    {mentor.linkedInUrl && (
                      <a href={mentor.linkedInUrl} target="_blank" rel="noopener" className="text-gray-500 hover:text-blue-700">
                        <FaLinkedin className="h-5 w-5" />
                      </a>
                    )}
                    {mentor.twitterUrl && (
                      <a href={mentor.twitterUrl} target="_blank" rel="noopener" className="text-gray-500 hover:text-blue-400">
                        <FaTwitter className="h-5 w-5" />
                      </a>
                    )}
                    {mentor.githubUrl && (
                      <a href={mentor.githubUrl} target="_blank" rel="noopener" className="text-gray-500 hover:text-gray-700">
                        <FaGithub className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:w-2/3 p-8">
              {/* Navigation Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "about" ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    <IoPerson className="inline mr-2" />
                    About
                  </button>
                  <button
                    onClick={() => setActiveTab("expertise")}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "expertise" ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    <IoRibbon className="inline mr-2" />
                    Expertise
                  </button>
                  {/* <button
                    onClick={() => setActiveTab("availability")}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "availability" ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    <FaCalendarAlt className="inline mr-2" />
                    Availability
                  </button> */}
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="py-6">
                {activeTab === "about" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900">About Me</h2>
                    <div className="mt-4 text-gray-600 leading-relaxed">
                      {mentor.bio || "No bio available."}
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
                      <div className="mt-4 space-y-4">
                        {mentor.experience?.length ? (
                          mentor.experience.map((exp, index) => (
                            <div key={index} className="border-l-4 border-teal-500 pl-4 py-1">
                              <h4 className="font-medium">{exp.position}</h4>
                              <p className="text-sm text-gray-500">{exp.company} • {exp.duration}</p>
                              {exp.description && (
                                <p className="mt-1 text-sm text-gray-600">{exp.description}</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No work experience listed</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === "expertise" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {mentor.skills?.length ? (
                            mentor.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500">No skills listed</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Mentorship Topics</h3>
                        <div className="mt-4 space-y-3">
                          {mentor.mentorshipTopics?.length ? (
                            mentor.mentorshipTopics.map((topic, index) => (
                              <div key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-700">{topic}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">No mentorship topics listed</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900">Education</h3>
                      <div className="mt-4 space-y-4">
                        {mentor.education?.length ? (
                          mentor.education.map((edu, index) => (
                            <div key={index} className="flex">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <h4 className="font-medium">{edu.degree}</h4>
                                <p className="text-sm text-gray-500">{edu.institution} • {edu.year}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No education information listed</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === "availability" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-medium text-gray-900">Weekly Availability</h3>
                    <div className="mt-6">
                      <MentorAvailabilityChart availability={mentor.availability} />
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900">Book a Session</h3>
                      <div className="mt-4 bg-teal-50 rounded-lg p-4 border border-teal-100">
                        {mentor.calendlyLink ? (
                          <a
                            href={mentor.calendlyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          >
                            <SiCalendly className="mr-2" />
                            Schedule on Calendly
                          </a>
                        ) : (
                          <p className="text-gray-500">No scheduling link available</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Edit Profile Button */}
        <div className="mt-8 text-right">
          <Link
            to="/mentor-update"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MentorUser;