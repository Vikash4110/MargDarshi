import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaUserClock, FaUserPlus, FaReply, FaBriefcase } from "react-icons/fa";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const MentorInsights = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { authorizationToken } = useAuth();
  const [insights, setInsights] = useState({
    pendingRequests: [],
    menteesGrowth: [],
    responseRate: 0,
    jobEngagement: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/auth/mentor-insights`, {
          method: "GET",
          headers: { Authorization: authorizationToken },
        });
        if (!response.ok) throw new Error("Failed to fetch insights");
        const data = await response.json();
        setInsights(data);
      } catch (err) {
        toast.error("Error fetching insights");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [authorizationToken]);

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top", 
        labels: { 
          font: { 
            size: 12, 
            family: "'Inter', sans-serif",
            weight: 500 
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: "'Inter', sans-serif", size: 14 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: {
          drawBorder: false,
          color: "rgba(0,0,0,0.05)"
        },
        ticks: { 
          font: { 
            family: "'Inter', sans-serif",
            size: 11
          },
          padding: 8
        } 
      },
      x: { 
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: { 
          font: { 
            family: "'Inter', sans-serif",
            size: 11
          },
          padding: 8
        } 
      },
    },
  };

  // 1. Pending Requests Line Chart
  const pendingData = {
    labels: insights.pendingRequests.map((r) => r._id),
    datasets: [
      {
        label: "Pending Requests",
        data: insights.pendingRequests.map((r) => r.count),
        borderColor: "#0f6f5c",
        backgroundColor: "rgba(15, 111, 92, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#0f6f5c",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
    ],
  };

  // 2. Mentees Growth Bar Chart
  const menteesData = {
    labels: insights.menteesGrowth.map((m) => m._id),
    datasets: [
      {
        label: "New Mentees",
        data: insights.menteesGrowth.map((m) => m.count),
        backgroundColor: "rgba(15, 111, 92, 0.7)",
        hoverBackgroundColor: "rgba(15, 111, 92, 0.9)",
        borderColor: "#0f6f5c",
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false
      },
    ],
  };

  // 3. Response Rate Pie Chart
  const responseData = {
    labels: ["Accepted", "Pending/Rejected"],
    datasets: [
      {
        data: [insights.responseRate, 100 - insights.responseRate],
        backgroundColor: ["#0f6f5c", "#e2e8f0"],
        borderWidth: 0,
        hoverOffset: 8
      },
    ],
  };

  // 4. Job Engagement Bar Chart
  const jobData = {
    labels: insights.jobEngagement.map((j) => j.title),
    datasets: [
      {
        label: "Applications",
        data: insights.jobEngagement.map((j) => j.applicationCount),
        backgroundColor: "rgba(15, 111, 92, 0.7)",
        hoverBackgroundColor: "rgba(15, 111, 92, 0.9)",
        borderColor: "#0f6f5c",
        borderWidth: 0,
        borderRadius: 4
      },
    ],
  };

  // Stats Cards Data
  const stats = [
    {
      title: "Pending Requests",
      value: insights.pendingRequests.reduce((acc, curr) => acc + curr.count, 0),
      icon: <FaUserClock className="text-2xl" />,
      color: "bg-amber-100 text-amber-600"
    },
    {
      title: "New Mentees",
      value: insights.menteesGrowth.reduce((acc, curr) => acc + curr.count, 0),
      icon: <FaUserPlus className="text-2xl" />,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      title: "Response Rate",
      value: `${insights.responseRate}%`,
      icon: <FaReply className="text-2xl" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Total Applications",
      value: insights.jobEngagement.reduce((acc, curr) => acc + curr.applicationCount, 0),
      icon: <FaBriefcase className="text-2xl" />,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f6f5c] to-teal-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1 flex items-center gap-3">
              <FaChartLine className="text-teal-200" /> Mentor Insights Dashboard
            </h2>
            <p className="opacity-90 text-teal-100">Track your mentoring impact and engagement metrics</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 md:mt-0 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-medium transition-all"
          >
            Export Report
          </motion.button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-xl shadow-sm ${stat.color} bg-opacity-50 backdrop-blur-sm`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium opacity-80">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-30`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#0f6f5c]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Requests */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Pending Requests Trend</h3>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                Last 30 Days
              </span>
            </div>
            <div className="h-72">
              <Line 
                data={pendingData} 
                options={{ 
                  ...chartOptions, 
                  plugins: {
                    ...chartOptions.plugins,
                    title: { 
                      display: false
                    }
                  }
                }} 
              />
            </div>
          </motion.div>

          {/* Mentees Growth */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Mentees Growth</h3>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                Monthly
              </span>
            </div>
            <div className="h-72">
              <Bar 
                data={menteesData} 
                options={{ 
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { 
                      display: false
                    }
                  }
                }} 
              />
            </div>
          </motion.div>

          {/* Response Rate */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Request Response Rate</h3>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                Overall
              </span>
            </div>
            <div className="h-72 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 mb-4">
                <Pie 
                  data={responseData} 
                  options={{ 
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        ...chartOptions.plugins.legend,
                        position: 'bottom'
                      },
                      title: { 
                        display: false
                      }
                    }
                  }} 
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">You accept <span className="font-bold text-[#0f6f5c]">{insights.responseRate}%</span> of requests</p>
                <p className="text-xs text-gray-500 mt-1">Industry average: 65-75%</p>
              </div>
            </div>
          </motion.div>

          {/* Job Engagement */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Job Post Engagement</h3>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                Applications
              </span>
            </div>
            <div className="h-72">
              <Bar 
                data={jobData} 
                options={{ 
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { 
                      display: false
                    }
                  },
                  scales: {
                    ...chartOptions.scales,
                    x: {
                      ...chartOptions.scales.x,
                      grid: {
                        display: true,
                        color: "rgba(0,0,0,0.05)"
                      }
                    }
                  }
                }} 
              />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MentorInsights;