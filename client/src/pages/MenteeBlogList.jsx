// src/components/MenteeBlogList.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const MenteeBlogList = () => {
  const { authorizationToken } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [authorizationToken]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/blogs/all`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (err) {
      toast.error(err.message || "Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-extrabold text-[#127C71] text-center mb-8">Mentor Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {blogs.map((blog) => (
          <motion.div
            key={blog._id}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: blogs.indexOf(blog) * 0.1, duration: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-gray-800">{blog.title}</h3>
            <p className="text-gray-600 mt-2 line-clamp-3">{blog.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              By: {blog.mentorId.fullName} | {blog.mentorId.jobTitle} at {blog.mentorId.company}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MenteeBlogList;