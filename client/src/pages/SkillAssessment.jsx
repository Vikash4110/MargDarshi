import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { 
  IoCheckmarkCircleOutline, 
  IoArrowBack, 
  IoArrowForward, 
  IoCodeSlash, 
  IoAnalytics, 
  IoGlobe, 
  IoPeople, 
  IoShieldCheckmark, 
  IoClipboard,
  IoCloud,
  IoConstruct,
  IoColorPalette,
  IoLink,
  IoBarChart,
  IoTime,
  IoRibbon,
  IoHelpCircle,
  IoStopwatch,
  IoAlertCircle,
  IoCloseCircle,
  IoCheckmarkCircle
} from "react-icons/io5";

// Primary color scheme
const COLORS = {
  primary: {
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
  },
  success: {
    500: "#10b981",
    600: "#059669",
  },
  warning: {
    500: "#f59e0b",
    600: "#d97706",
  },
  danger: {
    500: "#ef4444",
    600: "#dc2626",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
  }
};

const SkillAssessment = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [assessment, setAssessment] = useState(null);
  const [responses, setResponses] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [domainStats, setDomainStats] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const [warningShown, setWarningShown] = useState(false);
  const [showQuestionNav, setShowQuestionNav] = useState(false);

  useEffect(() => {
    fetchDomains();
    fetchHistory();
    fetchDomainStats();
    return () => {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  useEffect(() => {
    if (assessment && !score) {
      // Start elapsed timer
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      
      // Start countdown timer
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            submitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
    }
    return () => {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [assessment, score]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Show warnings at specific time intervals
  useEffect(() => {
    if (!assessment || score) return;

    if (timeLeft === 300 && !warningShown) { // 5 minutes left
      toast.warning(
        <div className="flex items-center gap-2">
          <IoAlertCircle className="text-xl" />
          <span>5 minutes remaining! Time is running out.</span>
        </div>,
        { autoClose: 5000 }
      );
      setWarningShown(true);
    } else if (timeLeft === 60) { // 1 minute left
      toast.warning(
        <div className="flex items-center gap-2">
          <IoAlertCircle className="text-xl" />
          <span>Only 1 minute left! Submit your answers soon.</span>
        </div>,
        { autoClose: 5000 }
      );
    }
  }, [timeLeft, assessment, score, warningShown]);

  const domainIcons = {
    Programming: <IoCodeSlash className="text-4xl" style={{ color: COLORS.primary[600] }} />,
    "Data Science": <IoAnalytics className="text-4xl" style={{ color: COLORS.primary[600] }} />,
    "Web Development": <IoGlobe className="text-4xl" style={{ color: COLORS.primary[600] }} />,
    "Machine Learning": <IoAnalytics className="text-4xl" style={{ color: COLORS.primary[600] }} />,
    "Soft Skills": <IoPeople className="text-4xl" style={{ color: COLORS.primary[600] }} />,
    Cybersecurity: <IoShieldCheckmark className="text-4xl" style={{ color: COLORS.primary[600] }} />,
    "Project Management": <IoClipboard className="text-4xl" style={{ color: COLORS.primary[600] }} />,
    "Cloud Computing": <IoCloud className="text-4xl" style={{ color: COLORS.primary[600] }} />,
    DevOps: <IoConstruct className="text-4xl" style={{ color: COLORS.primary[600] }} />,
    "UI/UX Design": <IoColorPalette className="text-4xl" style={{ color: COLORS.primary[600] }} />,
    "Database Management": <IoGlobe className="text-4xl" style={{ color: COLORS.primary[600] }} />,
    Blockchain: <IoLink className="text-4xl" style={{ color: COLORS.primary[600] }} />,
  };

  const fetchDomains = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to access assessments");
      const response = await fetch(`${backendUrl}/api/auth/assessment/domains`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch domains");
      const data = await response.json();
      setDomains(data.domains);
    } catch (err) {
      toast.error(err.message || "Error loading domains");
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to view history");
      const response = await fetch(`${backendUrl}/api/auth/assessment/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setHistory(data.history || []);
    } catch (err) {
      toast.error(err.message || "Error loading history");
    }
  };

  const fetchDomainStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to view stats");
      const response = await fetch(`${backendUrl}/api/auth/assessment/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setDomainStats(data.stats || {});
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const startAssessment = async (domain) => {
    setSelectedDomain(domain);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to start an assessment");
      const response = await fetch(`${backendUrl}/api/auth/assessment/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ domain }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to start assessment");
      }
      const data = await response.json();
      setAssessment(data);
      setResponses(Array(data.questions.length).fill(""));
      setScore(null);
      setCurrentQuestionIndex(0);
      setTimeElapsed(0);
      setTimeLeft(600); // Reset to 10 minutes
      setWarningShown(false);
    } catch (err) {
      toast.error(err.message || "Error starting assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (answer) => {
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = answer;
    setResponses(newResponses);
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowQuestionNav(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to submit assessment");
      const response = await fetch(`${backendUrl}/api/auth/assessment/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assessmentId: assessment._id,
          responses: assessment.questions.map((_, index) => ({
            questionIndex: index,
            selectedAnswer: responses[index],
          })),
          timeTaken: timeElapsed,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit assessment");
      }
      const data = await response.json();
      setScore(data.score);
      setHistory(prev => [{ 
        ...assessment, 
        score: data.score, 
        completedAt: new Date(),
        timeTaken: timeElapsed 
      }, ...prev]);
      fetchDomainStats();
      toast.success(
        <div className="flex items-center gap-2">
          <IoCheckmarkCircleOutline className="text-xl" />
          <span>Assessment submitted successfully in {formatTime(timeElapsed)}!</span>
        </div>
      );
    } catch (err) {
      toast.error(err.message || "Error submitting assessment");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!assessment) return 0;
    return ((currentQuestionIndex + 1) / assessment.questions.length) * 100;
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return "Expert";
    if (score >= 70) return "Advanced";
    if (score >= 50) return "Intermediate";
    return "Beginner";
  };

  const getPerformanceColor = (score) => {
    if (score >= 70) return COLORS.success[500];
    if (score >= 40) return COLORS.warning[500];
    return COLORS.danger[500];
  };

  const getQuestionStatus = (index) => {
    if (index === currentQuestionIndex) return "current";
    if (responses[index]) return "answered";
    return "unanswered";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Skill Assessment Center
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Test your knowledge, track your progress, and identify areas for improvement across various domains.
            </p>
          </div>
          {!assessment && (
            <motion.button
              onClick={() => setShowHistory(!showHistory)}
              className={`mt-4 md:mt-0 px-6 py-2 rounded-full flex items-center gap-2 ${
                showHistory ? "bg-gray-200 text-gray-800" : "bg-indigo-600 text-white"
              }`}
              style={{ backgroundColor: showHistory ? COLORS.gray[200] : COLORS.primary[600] }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoBarChart className="text-lg" />
              {showHistory ? "Back to Assessments" : "View History"}
            </motion.button>
          )}
        </motion.div>

        {/* Main Content */}
        {!showHistory ? (
          <>
            {/* Domain Selection with Cards */}
            {!assessment && (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {domains.map((domain) => (
                  <motion.div
                    key={domain}
                    className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4`}
                    style={{ borderLeftColor: COLORS.primary[600] }}
                    onClick={() => startAssessment(domain)}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: domains.indexOf(domain) * 0.1, duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-white shadow-sm">
                        {domainIcons[domain] || <IoCodeSlash className="text-3xl text-gray-600" />}
                      </div>
                      {domainStats[domain] && (
                        <div className="text-xs font-medium bg-black/10 px-2 py-1 rounded-full">
                          {domainStats[domain].attempts || 0} attempts
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{domain}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {domainStats[domain] 
                        ? `Avg. score: ${domainStats[domain].averageScore || 0}%` 
                        : "No attempts yet"}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${domainStats[domain]?.averageScore || 0}%`,
                          backgroundColor: getPerformanceColor(domainStats[domain]?.averageScore || 0)
                        }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Single Question Display */}
            {assessment && !score && (
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Question Navigation Card - Mobile */}
                <div className="lg:hidden mb-4">
                  <button 
                    onClick={() => setShowQuestionNav(!showQuestionNav)}
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: COLORS.primary[600] }}
                  >
                    {showQuestionNav ? 'Hide Questions' : 'Show Questions'} 
                    <IoBarChart className="text-lg" />
                  </button>
                </div>

                {/* Main Question Panel */}
                <motion.div
                  className="bg-white rounded-xl shadow-lg overflow-hidden flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Assessment Header */}
                  <div 
                    className="p-6 text-white"
                    style={{ background: `linear-gradient(to right, ${COLORS.primary[600]}, ${COLORS.primary[800]})` }}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                      <h2 className="text-2xl font-semibold">{assessment.domain} Assessment</h2>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                          <IoTime className="text-sm" />
                          <span className="text-sm font-medium">
                            Q{currentQuestionIndex + 1}/{assessment.questions.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-red-500/90 px-3 py-1 rounded-full">
                          <IoStopwatch className="text-sm" />
                          <span className="text-sm font-medium">
                            {formatTime(timeLeft)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full" 
                        style={{ width: `${calculateProgress()}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="p-6 md:p-8">
                    <motion.div
                      key={currentQuestionIndex}
                      className="mb-8"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-start gap-3 mb-6">
                        <div 
                          className="p-2 rounded-lg text-indigo-800"
                          style={{ backgroundColor: COLORS.primary[100] }}
                        >
                          <IoHelpCircle className="text-xl" />
                        </div>
                        <p className="text-xl font-medium text-gray-800 leading-relaxed">
                          {assessment.questions[currentQuestionIndex].questionText}
                        </p>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentQuestionIndex}
                          className="space-y-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {assessment.questions[currentQuestionIndex].options.map((option, idx) => (
                            <motion.label
                              key={option}
                              className={`block p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                                responses[currentQuestionIndex] === option 
                                  ? "border-indigo-500 shadow-sm" 
                                  : "border-gray-200 hover:border-indigo-300"
                              }`}
                              style={{
                                backgroundColor: responses[currentQuestionIndex] === option 
                                  ? COLORS.primary[50] 
                                  : "transparent",
                                borderColor: responses[currentQuestionIndex] === option 
                                  ? COLORS.primary[500]
                                  : COLORS.gray[200]
                              }}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex items-center">
                                <div 
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3`}
                                  style={{
                                    borderColor: responses[currentQuestionIndex] === option 
                                      ? COLORS.primary[600] 
                                      : COLORS.gray[300],
                                    backgroundColor: responses[currentQuestionIndex] === option 
                                      ? COLORS.primary[600] 
                                      : "transparent"
                                  }}
                                >
                                  {responses[currentQuestionIndex] === option && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  )}
                                </div>
                                <span className="text-gray-700">{option}</span>
                              </div>
                              <input
                                type="radio"
                                name={`question-${currentQuestionIndex}`}
                                value={option}
                                checked={responses[currentQuestionIndex] === option}
                                onChange={() => handleAnswerChange(option)}
                                className="hidden"
                              />
                            </motion.label>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-200">
                      <motion.button
                        onClick={prevQuestion}
                        className="flex items-center justify-center gap-2 py-2 px-5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                        style={{ backgroundColor: COLORS.gray[100] }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={currentQuestionIndex === 0 || loading}
                      >
                        <IoArrowBack /> Previous
                      </motion.button>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        {currentQuestionIndex === assessment.questions.length - 1 ? (
                          <motion.button
                            onClick={submitAssessment}
                            className="flex items-center justify-center gap-2 py-2 px-6 text-white rounded-lg disabled:opacity-70 transition-all"
                            style={{ 
                              background: `linear-gradient(to right, ${COLORS.primary[600]}, ${COLORS.primary[700]})`,
                              boxShadow: "0 4px 6px rgba(79, 70, 229, 0.3)"
                            }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                          >
                            {loading ? "Submitting..." : (
                              <>
                                Submit Assessment <IoRibbon className="text-lg" />
                              </>
                            )}
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={nextQuestion}
                            className="flex items-center justify-center gap-2 py-2 px-6 text-white rounded-lg disabled:opacity-70 transition-all"
                            style={{ 
                              background: `linear-gradient(to right, ${COLORS.primary[600]}, ${COLORS.primary[700]})`,
                              boxShadow: "0 4px 6px rgba(79, 70, 229, 0.3)"
                            }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                          >
                            Next Question <IoArrowForward />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Question Navigation Card - Desktop */}
                {!showQuestionNav ? (
                  <button 
                    onClick={() => setShowQuestionNav(true)}
                    className="hidden lg:flex fixed right-8 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                    style={{ backgroundColor: COLORS.primary[600] }}
                  >
                    <IoBarChart className="text-xl" />
                  </button>
                ) : (
                  <motion.div 
                    className="hidden lg:block w-64 bg-white rounded-xl shadow-lg overflow-hidden h-fit sticky top-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div 
                      className="p-4 text-white flex justify-between items-center"
                      style={{ background: `linear-gradient(to right, ${COLORS.primary[600]}, ${COLORS.primary[800]})` }}
                    >
                      <h3 className="font-medium">Questions</h3>
                      <button 
                        onClick={() => setShowQuestionNav(false)}
                        className="p-1 rounded-full hover:bg-white/20"
                      >
                        <IoCloseCircle className="text-lg" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-3">
                        {assessment.questions.map((_, index) => {
                          const status = getQuestionStatus(index);
                          return (
                            <button
                              key={index}
                              onClick={() => navigateToQuestion(index)}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                                status === "current" 
                                  ? "bg-indigo-600 text-white"
                                  : status === "answered" 
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              style={{
                                backgroundColor: status === "current" 
                                  ? COLORS.primary[600]
                                  : status === "answered"
                                    ? COLORS.success[500] + "20"
                                    : COLORS.gray[100],
                                color: status === "current"
                                  ? "white"
                                  : status === "answered"
                                    ? COLORS.success[600]
                                    : COLORS.gray[600]
                              }}
                            >
                              {index + 1}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                          <span className="text-xs">Current</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-xs">Answered</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                          <span className="text-xs">Unanswered</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Mobile Question Navigation Panel */}
                <AnimatePresence>
                  {showQuestionNav && (
                    <motion.div 
                      className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowQuestionNav(false)}
                    >
                      <motion.div 
                        className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div 
                          className="p-4 text-white flex justify-between items-center sticky top-0"
                          style={{ background: `linear-gradient(to right, ${COLORS.primary[600]}, ${COLORS.primary[800]})` }}
                        >
                          <h3 className="font-medium">Questions</h3>
                          <button 
                            onClick={() => setShowQuestionNav(false)}
                            className="p-1 rounded-full hover:bg-white/20"
                          >
                            <IoCloseCircle className="text-lg" />
                          </button>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-4 gap-3">
                            {assessment.questions.map((_, index) => {
                              const status = getQuestionStatus(index);
                              return (
                                <button
                                  key={index}
                                  onClick={() => navigateToQuestion(index)}
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                                    status === "current" 
                                      ? "bg-indigo-600 text-white"
                                      : status === "answered" 
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                  style={{
                                    backgroundColor: status === "current" 
                                      ? COLORS.primary[600]
                                      : status === "answered"
                                        ? COLORS.success[500] + "20"
                                        : COLORS.gray[100],
                                    color: status === "current"
                                      ? "white"
                                      : status === "answered"
                                        ? COLORS.success[600]
                                        : COLORS.gray[600]
                                  }}
                                >
                                  {index + 1}
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                              <span className="text-xs">Current</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              <span className="text-xs">Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                              <span className="text-xs">Unanswered</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Score Display */}
            {score !== null && (
              <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden text-center max-w-2xl mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div 
                  className="p-8"
                  style={{ background: `linear-gradient(to right, ${COLORS.primary[600]}, ${COLORS.primary[800]})` }}
                >
                  <div 
                    className="rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <IoCheckmarkCircleOutline className="text-white text-5xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Assessment Completed!</h2>
                  <p className="text-indigo-100">You've completed the {selectedDomain} assessment in {formatTime(timeElapsed)}</p>
                </div>
                
                <div className="p-8">
                  <div className="relative w-40 h-40 mx-auto mb-6">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        strokeDasharray={`${score * 2.51} 251`}
                        style={{ stroke: getPerformanceColor(score) }}
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-gray-800">{score}%</span>
                      <span className="text-sm text-gray-500">
                        {getPerformanceLevel(score)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Questions</div>
                      <div className="text-xl font-semibold">{assessment.questions.length}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Correct</div>
                      <div className="text-xl font-semibold">
                        {Math.round((score / 100) * assessment.questions.length)}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Time Taken</div>
                      <div className="text-xl font-semibold">{formatTime(timeElapsed)}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <motion.button
                      onClick={() => {
                        setAssessment(null);
                        setScore(null);
                        setSelectedDomain("");
                      }}
                      className="py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      style={{ backgroundColor: COLORS.gray[100] }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <IoArrowBack /> Take Another
                    </motion.button>
                    <motion.button
                      onClick={() => setShowHistory(true)}
                      className="py-3 px-6 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: COLORS.primary[600],
                        boxShadow: "0 4px 6px rgba(79, 70, 229, 0.3)"
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <IoBarChart /> View History
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          /* Assessment History */
          <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div 
              className="p-6 text-white"
              style={{ background: `linear-gradient(to right, ${COLORS.primary[600]}, ${COLORS.primary[800]})` }}
            >
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <IoBarChart className="text-2xl" />
                Your Assessment History
              </h2>
            </div>
            
            {history.length === 0 ? (
              <div className="p-8 text-center">
                <div 
                  className="p-6 rounded-xl inline-block mb-4"
                  style={{ backgroundColor: COLORS.gray[100] }}
                >
                  <IoBarChart className="text-4xl mx-auto" style={{ color: COLORS.gray[600] }} />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No assessment history yet</h3>
                <p className="text-gray-500 mb-4">Complete your first assessment to track your progress</p>
                <motion.button
                  onClick={() => setShowHistory(false)}
                  className="py-2 px-6 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  style={{ 
                    backgroundColor: COLORS.primary[600],
                    boxShadow: "0 4px 6px rgba(79, 70, 229, 0.3)"
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Browse Assessments
                </motion.button>
              </div>
            ) : (
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                      <tr>
                        <th className="p-3 font-medium">Domain</th>
                        <th className="p-3 font-medium">Score</th>
                        <th className="p-3 font-medium">Level</th>
                        <th className="p-3 font-medium">Time</th>
                        <th className="p-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {history.map((record) => (
                        <motion.tr
                          key={record._id || record.completedAt}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: COLORS.primary[100] }}
                              >
                                {domainIcons[record.domain] || <IoCodeSlash className="text-xl" />}
                              </div>
                              <span className="font-medium text-gray-800">{record.domain}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-16 bg-gray-200 rounded-full h-2"
                                style={{ backgroundColor: COLORS.gray[200] }}
                              >
                                <div 
                                  className="h-2 rounded-full"
                                  style={{ 
                                    width: `${record.score}%`,
                                    backgroundColor: getPerformanceColor(record.score)
                                  }}
                                ></div>
                              </div>
                              <span 
                                className="font-semibold"
                                style={{ 
                                  color: getPerformanceColor(record.score)
                                }}
                              >
                                {record.score}%
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: record.score >= 70 
                                  ? COLORS.success[500] + "20" 
                                  : record.score >= 40 
                                    ? COLORS.warning[500] + "20" 
                                    : COLORS.danger[500] + "20",
                                color: record.score >= 70 
                                  ? COLORS.success[600] 
                                  : record.score >= 40 
                                    ? COLORS.warning[600] 
                                    : COLORS.danger[600]
                              }}
                            >
                              {getPerformanceLevel(record.score)}
                            </span>
                          </td>
                          <td className="p-3 text-gray-600">
                            {formatTime(record.timeTaken || 0)}
                          </td>
                          <td className="p-3 text-gray-600">
                            {new Date(record.completedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <motion.button
                    onClick={() => setShowHistory(false)}
                    className="py-2 px-6 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    style={{ 
                      backgroundColor: COLORS.primary[600],
                      boxShadow: "0 4px 6px rgba(79, 70, 229, 0.3)"
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IoArrowBack /> Back to Assessments
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SkillAssessment;