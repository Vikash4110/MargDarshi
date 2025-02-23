import { useEffect, useState } from "react";
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
  IoLink
} from "react-icons/io5";

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

  useEffect(() => {
    fetchDomains();
    fetchHistory();
  }, []);

  const domainIcons = {
    Programming: <IoCodeSlash className="text-4xl text-teal-600" />,
    "Data Science": <IoAnalytics className="text-4xl text-teal-600" />,
    "Web Development": <IoGlobe className="text-4xl text-teal-600" />,
    "Machine Learning": <IoCodeSlash className="text-4xl text-teal-600" />,
    "Soft Skills": <IoPeople className="text-4xl text-teal-600" />,
    Cybersecurity: <IoShieldCheckmark className="text-4xl text-teal-600" />,
    "Project Management": <IoClipboard className="text-4xl text-teal-600" />,
    "Cloud Computing": <IoCloud className="text-4xl text-teal-600" />,
    DevOps: <IoConstruct className="text-4xl text-teal-600" />,
    "UI/UX Design": <IoColorPalette className="text-4xl text-teal-600" />,
    "Database Management": <IoGlobe className="text-4xl text-teal-600" />,
    Blockchain: <IoLink className="text-4xl text-teal-600" />,
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
    if (responses.some(r => !r)) {
      toast.error("Please answer all questions");
      return;
    }
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
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit assessment");
      }
      const data = await response.json();
      setScore(data.score);
      setHistory(prev => [{ ...assessment, score: data.score, completedAt: new Date() }, ...prev]);
      toast.success("Assessment submitted successfully!");
    } catch (err) {
      toast.error(err.message || "Error submitting assessment");
    } finally {
      setLoading(false);
    }
  };

  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 p-8 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Skill Assessment
        </motion.h1>

        {/* Domain Selection with Cards */}
        {!assessment && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {domains.map((domain) => (
              <motion.div
                key={domain}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                onClick={() => startAssessment(domain)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: domains.indexOf(domain) * 0.1, duration: 0.4 }}
              >
                <div className="flex items-center justify-center mb-4">
                  {domainIcons[domain] || <IoCodeSlash className="text-4xl text-teal-600" />}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center">{domain}</h3>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Single Question Display */}
        {assessment && !score && (
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{assessment.domain} Assessment</h2>
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-2">
                Question {currentQuestionIndex + 1} of {assessment.questions.length}
              </p>
              <motion.p
                key={currentQuestionIndex}
                className="text-xl font-medium text-gray-800 mb-6 leading-relaxed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {assessment.questions[currentQuestionIndex].questionText}
              </motion.p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {assessment.questions[currentQuestionIndex].options.map((option) => (
                    <motion.label
                      key={option}
                      className={`block mb-4 p-4 rounded-lg border border-gray-200 cursor-pointer transition-all duration-300 ${
                        responses[currentQuestionIndex] === option 
                          ? "bg-teal-100 border-teal-500" 
                          : "hover:bg-gray-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={option}
                        checked={responses[currentQuestionIndex] === option}
                        onChange={() => handleAnswerChange(option)}
                        className="hidden"
                      />
                      <span className="text-gray-700 text-lg">{option}</span>
                    </motion.label>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex justify-between">
              <motion.button
                onClick={prevQuestion}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentQuestionIndex === 0 || loading}
              >
                <IoArrowBack className="inline mr-2" /> Previous
              </motion.button>
              {currentQuestionIndex === assessment.questions.length - 1 ? (
                <motion.button
                  onClick={submitAssessment}
                  className="py-2 px-4 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 disabled:bg-gray-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Assessment"}
                </motion.button>
              ) : (
                <motion.button
                  onClick={nextQuestion}
                  className="py-2 px-4 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 disabled:bg-gray-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  Next <IoArrowForward className="inline ml-2" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Score Display */}
        {score !== null && (
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <IoCheckmarkCircleOutline className="text-teal-500 text-6xl mx-auto mb-6" />
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Assessment Completed!</h2>
            <p className="text-2xl text-gray-700 mb-8">
              Your Score: <span className="font-bold text-teal-600">{score}%</span>
            </p>
            <motion.button
              onClick={() => {
                setAssessment(null);
                setScore(null);
                setSelectedDomain("");
              }}
              className="py-3 px-6 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoArrowBack className="inline mr-2" /> Take Another Assessment
            </motion.button>
          </motion.div>
        )}

        {/* Assessment History */}
        {history.length > 0 && (
          <motion.div
            className="mt-12 bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Assessment History</h2>
            <ul className="space-y-4">
              {history.map((record) => (
                <motion.li
                  key={record._id}
                  className="bg-teal-50 p-4 rounded-lg shadow-sm flex justify-between items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="font-medium text-teal-700">{record.domain}</span>
                  <span className="text-gray-600">
                    Score: <span className="font-bold text-teal-600">{record.score}%</span> 
                    <span className="text-sm ml-2 text-gray-500">
                      ({new Date(record.completedAt).toLocaleDateString()})
                    </span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SkillAssessment;