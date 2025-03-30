// import React, { useState, useRef } from "react";
// import { motion } from "framer-motion";
// import { useAuth } from "../store/auth";
// import { toast } from "react-toastify";
// import { FaPaperPlane, FaTimes, FaImage } from "react-icons/fa";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const MentorBlogCreate = ({ onBlogCreated, onCancel }) => {
//   const { authorizationToken } = useAuth();
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [status, setStatus] = useState("draft");
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const quillRef = useRef(null); // Add ref for ReactQuill

//   const quillModules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ script: "sub" }, { script: "super" }],
//       [{ indent: "-1" }, { indent: "+1" }],
//       [{ size: ["small", false, "large", "huge"] }],
//       [{ color: [] }, { background: [] }],
//       ["link"],
//       ["clean"],
//     ],
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.size > 5 * 1024 * 1024) {
//       toast.error("Image size must be less than 5MB");
//       return;
//     }
//     setImage(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim() || !content.trim()) {
//       toast.error("Title and content are required");
//       return;
//     }
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("content", content);
//     formData.append("status", status);
//     if (image) formData.append("image", image);

//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/mentor-blogs/create`, {
//         method: "POST",
//         headers: {
//           Authorization: authorizationToken,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to create blog");
//       }
//       const data = await response.json();
//       toast.success("Blog created successfully!");
//       setTitle("");
//       setContent("");
//       setStatus("draft");
//       setImage(null);
//       onBlogCreated(data.blog);
//     } catch (err) {
//       toast.error(err.message || "Error creating blog");
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
//         className="bg-white p-8 rounded-2xl shadow-2xl border border-teal-100 w-full max-w-3xl relative"
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
//         <h2 className="text-3xl font-extrabold text-[#0f6f5c] mb-6">Create a New Blog</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-gray-800 font-semibold mb-2">Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 shadow-sm"
//               placeholder="Enter blog title"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-gray-800 font-semibold mb-2">Content</label>
//             <ReactQuill
//               ref={quillRef} // Attach ref to ReactQuill
//               value={content}
//               onChange={setContent}
//               modules={quillModules}
//               className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
//               placeholder="Write your blog content here..."
//             />
//           </div>
//           <div>
//             <label className="block text-gray-800 font-semibold mb-2">Blog Image (Optional)</label>
//             <input
//               type="file"
//               accept="image/jpeg,image/jpg,image/png"
//               onChange={handleImageChange}
//               className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm text-gray-700"
//             />
//             {image && (
//               <div className="mt-2">
//                 <img
//                   src={URL.createObjectURL(image)}
//                   alt="Blog Preview"
//                   className="w-32 h-32 object-cover rounded-lg shadow-sm"
//                 />
//               </div>
//             )}
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
//             {loading ? "Creating..." : (
//               <>
//                 <FaPaperPlane className="mr-2" /> Create Blog
//               </>
//             )}
//           </motion.button>
//         </form>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default MentorBlogCreate;

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FaPaperPlane, FaTimes, FaImage, FaSpinner } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const MentorBlogCreate = ({ onBlogCreated, onCancel }) => {
  const { authorizationToken } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image"
  ];

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  const validateAndSetImage = (file) => {
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file (JPEG, PNG)");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    
    setImage(file);
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title for your blog");
      return;
    }
    
    if (!content.trim() || content === "<p><br></p>") {
      toast.error("Please write some content for your blog");
      return;
    }
    
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", status);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/mentor-blogs/create`, {
        method: "POST",
        headers: {
          Authorization: authorizationToken,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog");
      }
      
      const data = await response.json();
      toast.success("Blog created successfully!");
      resetForm();
      onBlogCreated(data.blog);
    } catch (err) {
      toast.error(err.message || "Error creating blog");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setStatus("draft");
    setImage(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-teal-100 w-full max-w-3xl relative mx-4 my-8"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-500 hover:text-teal-600 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes size={24} />
          </motion.button>
          
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Create New Blog Post</h2>
            <p className="text-gray-500">Share your knowledge and insights with the community</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-gray-700 font-medium">Title*</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                placeholder="Catchy blog title..."
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-gray-700 font-medium">Content*</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  ref={quillRef}
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white"
                  placeholder="Write your amazing content here..."
                  theme="snow"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-gray-700 font-medium">Featured Image</label>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-gray-400"}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                {image ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Blog Preview"
                      className="max-h-60 w-auto mx-auto rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <FiUpload className="text-3xl text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      <span className="text-teal-600 font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-400">JPEG or PNG (Max. 5MB)</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-gray-700 font-medium">Status</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="draft"
                    checked={status === "draft"}
                    onChange={() => setStatus("draft")}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-gray-700">Draft</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="published"
                    checked={status === "published"}
                    onChange={() => setStatus("published")}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-gray-700">Publish</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <motion.button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium flex items-center"
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Processing...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" /> {status === "draft" ? "Save Draft" : "Publish Now"}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MentorBlogCreate;