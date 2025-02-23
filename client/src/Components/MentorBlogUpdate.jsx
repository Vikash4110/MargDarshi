// src/components/MentorBlogUpdate.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FaPaperPlane } from "react-icons/fa";

const MentorBlogUpdate = ({ blog, onBlogUpdated, onCancel }) => {
  const { authorizationToken } = useAuth();
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [status, setStatus] = useState(blog.status);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/mentor-blogs/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ blogId: blog._id, title, content, status }),
      });

      if (!response.ok) throw new Error("Failed to update blog");
      const data = await response.json();
      toast.success("Blog updated successfully!");
      onBlogUpdated(data.blog); // Callback to update blog list
    } catch (err) {
      toast.error(err.message || "Error updating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-[#127C71] mb-4">Update Blog</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-40"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex space-x-4">
          <motion.button
            type="submit"
            className="flex-1 py-3 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Updating..." : <><FaPaperPlane className="mr-2" /> Update Blog</>}
          </motion.button>
          <motion.button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default MentorBlogUpdate;