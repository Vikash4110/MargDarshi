// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { useAuth } from "../store/auth";
// import { toast } from "react-toastify";
// import { FaPaperPlane, FaTimes } from "react-icons/fa";

// const MentorBlogUpdate = ({ blog, onBlogUpdated, onCancel }) => {
//   const { authorizationToken } = useAuth();
//   const [title, setTitle] = useState(blog.title);
//   const [content, setContent] = useState(blog.content);
//   const [status, setStatus] = useState(blog.status);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim() || !content.trim()) {
//       toast.error("Title and content are required");
//       return;
//     }
//     setLoading(true);

//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/mentor-blogs/update`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify({ blogId: blog._id, title, content, status }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update blog");
//       }
//       const data = await response.json();
//       toast.success("Blog updated successfully!");
//       onBlogUpdated(data.blog);
//     } catch (err) {
//       toast.error(err.message || "Error updating blog");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <motion.div
//         className="bg-white p-8 rounded-2xl shadow-2xl border border-teal-100 w-full max-w-2xl relative"
//         initial={{ scale: 0.9 }}
//         animate={{ scale: 1 }}
//         transition={{ duration: 0.3 }}
//       >
//         <motion.button
//           onClick={onCancel}
//           className="absolute top-4 right-4 text-gray-700 hover:text-teal-600"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <FaTimes size={24} />
//         </motion.button>
//         <h2 className="text-3xl font-extrabold text-[#0f6f5c] mb-6">Update Blog</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-gray-800 font-semibold mb-2">Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 shadow-sm"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-gray-800 font-semibold mb-2">Content</label>
//             <textarea
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 h-48 resize-none shadow-sm"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-gray-800 font-semibold mb-2">Status</label>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 shadow-sm"
//             >
//               <option value="draft">Draft</option>
//               <option value="published">Published</option>
//             </select>
//           </div>
//           <motion.button
//             type="submit"
//             className="w-full py-3 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 flex items-center justify-center font-semibold"
//             whileHover={{ scale: loading ? 1 : 1.05 }}
//             whileTap={{ scale: loading ? 1 : 0.95 }}
//             disabled={loading}
//           >
//             {loading ? "Updating..." : <><FaPaperPlane className="mr-2" /> Update Blog</>}
//           </motion.button>
//         </form>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default MentorBlogUpdate;

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FaPaperPlane, FaTimes, FaImage } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const MentorBlogUpdate = ({ blog, onBlogUpdated, onCancel }) => {
  const { authorizationToken } = useAuth();
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [status, setStatus] = useState(blog.status);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null); // Add ref for ReactQuill
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("blogId", blog._id);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", status);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-blogs/update`, {
        method: "PATCH",
        headers: {
          Authorization: authorizationToken,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update blog");
      }
      const data = await response.json();
      toast.success("Blog updated successfully!");
      onBlogUpdated(data.blog);
    } catch (err) {
      toast.error(err.message || "Error updating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl border border-teal-100 w-full max-w-3xl relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-700 hover:text-teal-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaTimes size={24} />
        </motion.button>
        <h2 className="text-3xl font-extrabold text-[#0f6f5c] mb-6">Update Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Content</label>
            <ReactQuill
              ref={quillRef} // Attach ref to ReactQuill
              value={content}
              onChange={setContent}
              modules={quillModules}
              className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Blog Image (Optional)</label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm text-gray-700"
            />
            {(image || blog.image) && (
              <div className="mt-2">
                <img
                  src={image ? URL.createObjectURL(image) : `${backendUrl}/api/auth/images/${blog.image}`}
                  alt="Blog Preview"
                  className="w-32 h-32 object-cover rounded-lg shadow-sm"
                  onError={(e) => (e.target.src = defaultProfilePic)}
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 shadow-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 flex items-center justify-center font-semibold"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading}
          >
            {loading ? "Updating..." : (
              <>
                <FaPaperPlane className="mr-2" /> Update Blog
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MentorBlogUpdate;