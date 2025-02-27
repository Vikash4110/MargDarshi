// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAuth } from "../store/auth";
// import { toast } from "react-toastify";
// import { FaEdit, FaTrash, FaHeart, FaComment, FaShare, FaPaperPlane, FaPlus, FaTimes } from "react-icons/fa";
// import MentorBlogUpdate from "./MentorBlogUpdate";
// import MentorBlogCreate from "./MentorBlogCreate";
// import { useNavigate } from "react-router-dom";
// import defaultProfilePic from "../assets/profile2.jpg";

// const MentorBlogList = () => {
//   const { authorizationToken, user, logoutUser } = useAuth();
//   const [myBlogs, setMyBlogs] = useState([]);
//   const [otherBlogs, setOtherBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBlog, setSelectedBlog] = useState(null);
//   const [commentInputs, setCommentInputs] = useState({});
//   const [activeTab, setActiveTab] = useState("myBlogs");
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const navigate = useNavigate();
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   useEffect(() => {
//     fetchBlogs();
//   }, [authorizationToken]);

//   const fetchBlogs = async () => {
//     setLoading(true);
//     try {
//       if (!authorizationToken) throw new Error("User not authenticated");

//       const myBlogsResponse = await fetch(`${backendUrl}/api/auth/mentor-blogs`, {
//         method: "GET",
//         headers: { Authorization: authorizationToken },
//       });
//       if (!myBlogsResponse.ok) {
//         if (myBlogsResponse.status === 401) {
//           logoutUser();
//           navigate("/mentor-login");
//           throw new Error("Session expired, please log in again");
//         }
//         throw new Error("Failed to fetch my blogs");
//       }
//       const myBlogsData = await myBlogsResponse.json();

//       const otherBlogsResponse = await fetch(`${backendUrl}/api/auth/blogs/all`, {
//         method: "GET",
//         headers: { Authorization: authorizationToken },
//       });
//       if (!otherBlogsResponse.ok) {
//         if (otherBlogsResponse.status === 401) {
//           logoutUser();
//           navigate("/mentor-login");
//           throw new Error("Session expired, please log in again");
//         }
//         throw new Error("Failed to fetch other blogs");
//       }
//       const otherBlogsData = await otherBlogsResponse.json();

//       const processBlogs = (blogs) =>
//         blogs.map((blog) => ({
//           ...blog,
//           mentorId: {
//             ...blog.mentorId,
//             profilePicture: blog.mentorId?.profilePicture
//               ? `${backendUrl}/api/auth/images/${blog.mentorId.profilePicture}`
//               : defaultProfilePic,
//           },
//           comments: blog.comments.map((comment) => ({
//             ...comment,
//             userId: {
//               _id: comment.userId?._id || comment.userId,
//               fullName: comment.userId?.fullName || "Anonymous",
//               profilePicture: comment.userId?.profilePicture
//                 ? `${backendUrl}/api/auth/images/${comment.userId.profilePicture}`
//                 : defaultProfilePic,
//             },
//           })),
//         }));

//       setMyBlogs(processBlogs(myBlogsData.blogs || []));
//       setOtherBlogs(processBlogs(otherBlogsData.blogs || []));
//     } catch (err) {
//       toast.error(err.message || "Error fetching blogs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (blogId) => {
//     if (!window.confirm("Are you sure you want to delete this blog?")) return;

//     try {
//       const response = await fetch(`${backendUrl}/api/auth/mentor-blogs/delete/${blogId}`, {
//         method: "DELETE",
//         headers: { Authorization: authorizationToken },
//       });
//       if (!response.ok) {
//         if (response.status === 401) {
//           logoutUser();
//           navigate("/mentor-login");
//           throw new Error("Session expired, please log in again");
//         }
//         throw new Error("Failed to delete blog");
//       }
//       setMyBlogs(myBlogs.filter((blog) => blog._id !== blogId));
//       setSelectedBlog(null);
//       toast.success("Blog deleted successfully!");
//     } catch (err) {
//       toast.error(err.message || "Error deleting blog");
//     }
//   };

//   const handleBlogCreated = (newBlog) => {
//     const processedBlog = {
//       ...newBlog,
//       mentorId: {
//         ...newBlog.mentorId,
//         profilePicture: newBlog.mentorId?.profilePicture
//           ? `${backendUrl}/api/auth/images/${newBlog.mentorId.profilePicture}`
//           : defaultProfilePic,
//       },
//       comments: [],
//     };
//     setMyBlogs([...myBlogs, processedBlog]);
//     setIsCreateOpen(false);
//   };

//   const handleBlogUpdated = (updatedBlog) => {
//     setMyBlogs(myBlogs.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog)));
//     setSelectedBlog(null);
//   };

//   const handleLike = async (blogId, isMyBlog) => {
//     if (!authorizationToken) {
//       toast.error("Please log in to like");
//       return;
//     }
//     try {
//       const response = await fetch(`${backendUrl}/api/auth/blogs/like`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify({ blogId }),
//       });
//       if (!response.ok) {
//         if (response.status === 401) {
//           logoutUser();
//           navigate("/mentor-login");
//           throw new Error("Session expired, please log in again");
//         }
//         throw new Error("Failed to like blog");
//       }
//       const data = await response.json();
//       if (isMyBlog) {
//         setMyBlogs(myBlogs.map((blog) => (blog._id === blogId ? data.blog : blog)));
//         if (selectedBlog && selectedBlog._id === blogId) setSelectedBlog(data.blog);
//       } else {
//         setOtherBlogs(otherBlogs.map((blog) => (blog._id === blogId ? data.blog : blog)));
//         if (selectedBlog && selectedBlog._id === blogId) setSelectedBlog(data.blog);
//       }
//       toast.success(data.message);
//     } catch (err) {
//       toast.error(err.message || "Error liking blog");
//     }
//   };

//   const handleComment = async (blogId, isMyBlog) => {
//     const content = commentInputs[blogId]?.trim();
//     if (!content) {
//       toast.error("Comment cannot be empty");
//       return;
//     }
//     if (!authorizationToken) {
//       toast.error("Please log in to comment");
//       return;
//     }

//     try {
//       const response = await fetch(`${backendUrl}/api/auth/blogs/comment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify({ blogId, content }),
//       });
//       if (!response.ok) {
//         if (response.status === 401) {
//           logoutUser();
//           navigate("/mentor-login");
//           throw new Error("Session expired, please log in again");
//         }
//         throw new Error("Failed to comment on blog");
//       }
//       const data = await response.json();
//       const updatedBlog = {
//         ...data.blog,
//         mentorId: {
//           ...data.blog.mentorId,
//           profilePicture: data.blog.mentorId?.profilePicture
//             ? `${backendUrl}/api/auth/images/${data.blog.mentorId.profilePicture}`
//             : defaultProfilePic,
//         },
//         comments: data.blog.comments.map((comment) => ({
//           ...comment,
//           userId: {
//             _id: comment.userId?._id || comment.userId,
//             fullName: comment.userId?.fullName || user?.fullName || "Anonymous", // Use logged-in user's name if available
//             profilePicture: comment.userId?.profilePicture
//               ? `${backendUrl}/api/auth/images/${comment.userId.profilePicture}`
//               : user?.profilePicture || defaultProfilePic, // Use logged-in user's picture if available
//           },
//         })),
//       };
//       if (isMyBlog) {
//         setMyBlogs(myBlogs.map((blog) => (blog._id === blogId ? updatedBlog : blog)));
//       } else {
//         setOtherBlogs(otherBlogs.map((blog) => (blog._id === blogId ? updatedBlog : blog)));
//       }
//       setSelectedBlog(updatedBlog); // Update selected blog to reflect new comment
//       setCommentInputs({ ...commentInputs, [blogId]: "" });
//       toast.success("Comment added successfully!");
//     } catch (err) {
//       toast.error(err.message || "Error commenting on blog");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100">
//         <motion.div
//           className="text-teal-600 text-lg font-semibold"
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1 }}
//         >
//           <FaPaperPlane size={32} />
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 p-8">
//       {/* Header */}
//       <motion.div
//         className="text-center mb-12 relative"
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         <h1 className="text-5xl font-extrabold text-[#0f6f5c] tracking-tight drop-shadow-lg">
//           MargDarshi Blogs
//         </h1>
//         <p className="text-lg text-gray-700 mt-2 font-medium">
//           Share your wisdom and explore the community’s insights.
//         </p>
//         <motion.button
//           onClick={() => setIsCreateOpen(true)}
//           className="absolute top-0 right-0 px-6 py-3 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 flex items-center font-semibold"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <FaPlus className="mr-2" /> Create New Blog
//         </motion.button>
//       </motion.div>

//       {/* Tabs */}
//       <div className="max-w-7xl mx-auto mb-8">
//         <div className="flex justify-center space-x-6">
//           <motion.button
//             onClick={() => setActiveTab("myBlogs")}
//             className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === "myBlogs" ? "bg-[#0f6f5c] text-white shadow-lg" : "bg-white text-[#0f6f5c] border border-teal-200 hover:bg-teal-50"}`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             My Blogs
//           </motion.button>
//           <motion.button
//             onClick={() => setActiveTab("otherBlogs")}
//             className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === "otherBlogs" ? "bg-[#0f6f5c] text-white shadow-lg" : "bg-white text-[#0f6f5c] border border-teal-200 hover:bg-teal-50"}`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Other Mentors' Blogs
//           </motion.button>
//         </div>
//       </div>

//       {/* Blog Content */}
//       <AnimatePresence mode="wait">
//         {activeTab === "myBlogs" && (
//           <motion.div
//             key="myBlogs"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.5 }}
//             className="max-w-7xl mx-auto"
//           >
//             {myBlogs.length === 0 ? (
//               <p className="text-center text-gray-600 text-lg font-semibold">You haven’t created any blogs yet.</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {myBlogs.map((blog) => (
//                   <BlogCard
//                     key={blog._id}
//                     blog={blog}
//                     onClick={() => setSelectedBlog(blog)}
//                     onLike={() => handleLike(blog._id, true)}
//                     isEditable={true}
//                   />
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         )}

//         {activeTab === "otherBlogs" && (
//           <motion.div
//             key="otherBlogs"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.5 }}
//             className="max-w-7xl mx-auto"
//           >
//             {otherBlogs.length === 0 ? (
//               <p className="text-center text-gray-600 text-lg font-semibold">No blogs from other mentors yet.</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {otherBlogs.map((blog) => (
//                   <BlogCard
//                     key={blog._id}
//                     blog={blog}
//                     onClick={() => setSelectedBlog(blog)}
//                     onLike={() => handleLike(blog._id, false)}
//                     isEditable={false}
//                   />
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Blog Detail Modal */}
//       <AnimatePresence>
//         {selectedBlog && (
//           <motion.div
//             className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             onClick={() => setSelectedBlog(null)}
//           >
//             <motion.div
//               className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative border border-teal-200"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <motion.button
//                 onClick={() => setSelectedBlog(null)}
//                 className="absolute top-4 right-4 text-gray-700 hover:text-teal-600"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <FaTimes size={28} />
//               </motion.button>
//               <div className="flex items-center mb-6">
//                 <img
//                   src={selectedBlog.mentorId?.profilePicture}
//                   alt={selectedBlog.mentorId?.fullName || "Mentor"}
//                   className="w-12 h-12 rounded-full mr-4 border-2 border-teal-500 shadow-md object-cover"
//                   onError={(e) => (e.target.src = defaultProfilePic)}
//                 />
//                 <div>
//                   <p className="font-bold text-gray-900 text-xl">{selectedBlog.mentorId?.fullName || "Unknown"}</p>
//                   <p className="text-sm text-gray-600">
//                     {selectedBlog.mentorId?.jobTitle || "Mentor"} at {selectedBlog.mentorId?.company || "N/A"} •{" "}
//                     {new Date(selectedBlog.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//               <h2 className="text-3xl font-extrabold text-[#0f6f5c] mb-4">{selectedBlog.title}</h2>
//               <p className="text-gray-800 mb-6 leading-relaxed text-lg">{selectedBlog.content}</p>
//               <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-6">
//                 <div className="flex space-x-6 text-gray-700">
//                   <motion.button
//                     onClick={() => handleLike(selectedBlog._id, activeTab === "myBlogs")}
//                     className={`flex items-center space-x-2 ${
//                       selectedBlog.likes.some((l) => l.userId.toString() === user?._id) ? "text-red-500" : "text-gray-600"
//                     }`}
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     <FaHeart size={20} />
//                     <span className="font-medium">{selectedBlog.likes.length}</span>
//                   </motion.button>
//                   <span className="flex items-center space-x-2">
//                     <FaComment size={20} />
//                     <span className="font-medium">{selectedBlog.comments.length}</span>
//                   </span>
//                   <span className="flex items-center space-x-2">
//                     <FaShare size={20} />
//                     <span className="font-medium">{selectedBlog.shares.length}</span>
//                   </span>
//                 </div>
//                 {activeTab === "myBlogs" && (
//                   <div className="flex space-x-4">
//                     <motion.button
//                       onClick={() => setSelectedBlog({ ...selectedBlog, isEditing: true })}
//                       className="px-4 py-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 flex items-center font-semibold transition-all duration-300"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       <FaEdit className="mr-2" /> Edit
//                     </motion.button>
//                     <motion.button
//                       onClick={() => handleDelete(selectedBlog._id)}
//                       className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 flex items-center font-semibold transition-all duration-300"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       <FaTrash className="mr-2" /> Delete
//                     </motion.button>
//                   </div>
//                 )}
//               </div>
//               <div className="space-y-4">
//                 {selectedBlog.comments.map((comment) => (
//                   <div key={comment._id} className="bg-gray-50 p-3 rounded-lg flex items-start space-x-3">
//                     <img
//                       src={comment.userId.profilePicture || defaultProfilePic}
//                       alt={comment.userId.fullName || "Commenter"}
//                       className="w-10 h-10 rounded-full border border-gray-300 shadow-sm object-cover"
//                       onError={(e) => (e.target.src = defaultProfilePic)}
//                     />
//                     <div>
//                       <p className="text-sm font-semibold text-gray-900">{comment.userId.fullName || "Anonymous"}</p>
//                       <p className="text-gray-700 text-base">{comment.content}</p>
//                       <p className="text-xs text-gray-500 mt-1">{comment.userModel}</p>
//                     </div>
//                   </div>
//                 ))}
//                 <div className="flex items-start space-x-4 mt-6">
//                   <img
//                     src={user?.profilePicture || defaultProfilePic}
//                     alt={user?.fullName || "User"}
//                     className="w-10 h-10 rounded-full border border-gray-300 shadow-sm object-cover"
//                     onError={(e) => (e.target.src = defaultProfilePic)}
//                   />
//                   <div className="flex-1 flex">
//                     <input
//                       type="text"
//                       value={commentInputs[selectedBlog._id] || ""}
//                       onChange={(e) => setCommentInputs({ ...commentInputs, [selectedBlog._id]: e.target.value })}
//                       className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm shadow-sm"
//                       placeholder="Add your comment..."
//                     />
//                     <motion.button
//                       onClick={() => handleComment(selectedBlog._id, activeTab === "myBlogs")}
//                       className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-r-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       <FaPaperPlane size={18} />
//                     </motion.button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Modals */}
//       {selectedBlog?.isEditing && (
//         <MentorBlogUpdate
//           blog={selectedBlog}
//           onBlogUpdated={handleBlogUpdated}
//           onCancel={() => setSelectedBlog(null)}
//         />
//       )}
//       {isCreateOpen && (
//         <MentorBlogCreate onBlogCreated={handleBlogCreated} onCancel={() => setIsCreateOpen(false)} />
//       )}
//     </div>
//   );
// };

// // Blog Card Component
// const BlogCard = ({ blog, onClick, onLike, isEditable }) => {
//   const { user } = useAuth();

//   return (
//     <motion.div
//       className="bg-white rounded-xl shadow-lg border border-teal-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
//       onClick={onClick}
//     >
//       <div className="flex items-center mb-4">
//         <img
//           src={blog.mentorId?.profilePicture}
//           alt={blog.mentorId?.fullName || "Mentor"}
//           className="w-10 h-10 rounded-full mr-3 border-2 border-teal-400 shadow-sm object-cover"
//           onError={(e) => (e.target.src = defaultProfilePic)}
//         />
//         <div>
//           <p className="font-semibold text-gray-900">{blog.mentorId?.fullName || "Unknown"}</p>
//           <p className="text-xs text-gray-500">
//             {blog.mentorId?.jobTitle || "Mentor"} at {blog.mentorId?.company || "N/A"} •{" "}
//             {new Date(blog.createdAt).toLocaleDateString()}
//           </p>
//         </div>
//       </div>
//       <h3 className="text-xl font-bold text-[#0f6f5c] mb-2">{blog.title}</h3>
//       <p className="text-gray-700 mb-4 line-clamp-3">{blog.content}</p>
//       <p className="text-sm text-gray-500 mb-4">
//         Status: <span className={blog.status === "published" ? "text-green-500" : "text-yellow-500"}>{blog.status}</span>
//       </p>
//       <div className="flex items-center justify-between text-gray-600">
//         <div className="flex space-x-4">
//           <motion.button
//             onClick={(e) => { e.stopPropagation(); onLike(); }}
//             className={`flex items-center space-x-1 ${
//               blog.likes.some((l) => l.userId.toString() === user?._id) ? "text-red-500" : "text-gray-500"
//             }`}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <FaHeart />
//             <span>{blog.likes.length}</span>
//           </motion.button>
//           <span className="flex items-center space-x-1">
//             <FaComment />
//             <span>{blog.comments.length}</span>
//           </span>
//           <span className="flex items-center space-x-1">
//             <FaShare />
//             <span>{blog.shares.length}</span>
//           </span>
//         </div>
//       </div>
//     </motion.div>
//   );
// };


// export default MentorBlogList;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaHeart, FaComment, FaShare, FaPaperPlane, FaPlus, FaTimes } from "react-icons/fa";
import MentorBlogUpdate from "./MentorBlogUpdate";
import MentorBlogCreate from "./MentorBlogCreate";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../assets/profile2.jpg";
import MDEditor from "@uiw/react-md-editor";

const MentorBlogList = () => {
  const { authorizationToken, user, logoutUser } = useAuth();
  const [myBlogs, setMyBlogs] = useState([]);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [activeTab, setActiveTab] = useState("myBlogs");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchBlogs();
  }, [authorizationToken]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      if (!authorizationToken) throw new Error("User not authenticated");

      const myBlogsResponse = await fetch(`${backendUrl}/api/auth/mentor-blogs`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      if (!myBlogsResponse.ok) {
        if (myBlogsResponse.status === 401) {
          logoutUser();
          navigate("/mentor-login");
          throw new Error("Session expired, please log in again");
        }
        throw new Error("Failed to fetch my blogs");
      }
      const myBlogsData = await myBlogsResponse.json();

      const otherBlogsResponse = await fetch(`${backendUrl}/api/auth/blogs/all`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      if (!otherBlogsResponse.ok) {
        if (otherBlogsResponse.status === 401) {
          logoutUser();
          navigate("/mentor-login");
          throw new Error("Session expired, please log in again");
        }
        throw new Error("Failed to fetch other blogs");
      }
      const otherBlogsData = await otherBlogsResponse.json();

      const processBlogs = (blogs) =>
        blogs.map((blog) => ({
          ...blog,
          mentorId: {
            ...blog.mentorId,
            profilePicture: blog.mentorId?.profilePicture
              ? `${backendUrl}/api/auth/images/${blog.mentorId.profilePicture}`
              : defaultProfilePic,
          },
          image: blog.image ? `${backendUrl}/uploads/blogs/${blog.image}` : null,
          comments: blog.comments.map((comment) => ({
            ...comment,
            userId: {
              _id: comment.userId?._id || comment.userId,
              fullName: comment.userId?.fullName || "Anonymous",
              profilePicture: comment.userId?.profilePicture
                ? `${backendUrl}/api/auth/images/${comment.userId.profilePicture}`
                : defaultProfilePic,
            },
          })),
        }));

      setMyBlogs(processBlogs(myBlogsData.blogs || []));
      setOtherBlogs(processBlogs(otherBlogsData.blogs || []));
    } catch (err) {
      toast.error(err.message || "Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-blogs/delete/${blogId}`, {
        method: "DELETE",
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) {
        if (response.status === 401) {
          logoutUser();
          navigate("/mentor-login");
          throw new Error("Session expired, please log in again");
        }
        throw new Error("Failed to delete blog");
      }
      setMyBlogs(myBlogs.filter((blog) => blog._id !== blogId));
      setSelectedBlog(null);
      toast.success("Blog deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Error deleting blog");
    }
  };

  const handleBlogCreated = (newBlog) => {
    const processedBlog = {
      ...newBlog,
      mentorId: {
        ...newBlog.mentorId,
        profilePicture: newBlog.mentorId?.profilePicture
          ? `${backendUrl}/api/auth/images/${newBlog.mentorId.profilePicture}`
          : defaultProfilePic,
      },
      image: newBlog.image ? `${backendUrl}/uploads/blogs/${newBlog.image}` : null,
      comments: [],
    };
    setMyBlogs([...myBlogs, processedBlog]);
    setIsCreateOpen(false);
  };

  const handleBlogUpdated = (updatedBlog) => {
    const processedBlog = {
      ...updatedBlog,
      image: updatedBlog.image ? `${backendUrl}/uploads/blogs/${updatedBlog.image}` : null,
    };
    setMyBlogs(myBlogs.map((blog) => (blog._id === updatedBlog._id ? processedBlog : blog)));
    setSelectedBlog(null);
  };

  const handleLike = async (blogId, isMyBlog) => {
    if (!authorizationToken) {
      toast.error("Please log in to like");
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/api/auth/blogs/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ blogId }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          logoutUser();
          navigate("/mentor-login");
          throw new Error("Session expired, please log in again");
        }
        throw new Error("Failed to like blog");
      }
      const data = await response.json();
      const updatedBlog = {
        ...data.blog,
        image: data.blog.image ? `${backendUrl}/uploads/blogs/${data.blog.image}` : null, // Preserve image URL
      };
      if (isMyBlog) {
        setMyBlogs(myBlogs.map((blog) => (blog._id === blogId ? updatedBlog : blog)));
        if (selectedBlog && selectedBlog._id === blogId) setSelectedBlog(updatedBlog);
      } else {
        setOtherBlogs(otherBlogs.map((blog) => (blog._id === blogId ? updatedBlog : blog)));
        if (selectedBlog && selectedBlog._id === blogId) setSelectedBlog(updatedBlog);
      }
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || "Error liking blog");
    }
  };

  const handleComment = async (blogId, isMyBlog) => {
    const content = commentInputs[blogId]?.trim();
    if (!content) {
      toast.error("Comment cannot be empty");
      return;
    }
    if (!authorizationToken) {
      toast.error("Please log in to comment");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/auth/blogs/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ blogId, content }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          logoutUser();
          navigate("/mentor-login");
          throw new Error("Session expired, please log in again");
        }
        throw new Error("Failed to comment on blog");
      }
      const data = await response.json();
      const updatedBlog = {
        ...data.blog,
        mentorId: {
          ...data.blog.mentorId,
          profilePicture: data.blog.mentorId?.profilePicture
            ? `${backendUrl}/api/auth/images/${data.blog.mentorId.profilePicture}`
            : defaultProfilePic,
        },
        image: data.blog.image ? `${backendUrl}/uploads/blogs/${data.blog.image}` : null,
        comments: data.blog.comments.map((comment) => ({
          ...comment,
          userId: {
            _id: comment.userId?._id || comment.userId,
            fullName: comment.userId?.fullName || user?.fullName || "Anonymous",
            profilePicture: comment.userId?.profilePicture
              ? `${backendUrl}/api/auth/images/${comment.userId.profilePicture}`
              : user?.profilePicture || defaultProfilePic,
          },
        })),
      };
      if (isMyBlog) {
        setMyBlogs(myBlogs.map((blog) => (blog._id === blogId ? updatedBlog : blog)));
      } else {
        setOtherBlogs(otherBlogs.map((blog) => (blog._id === blogId ? updatedBlog : blog)));
      }
      setSelectedBlog(updatedBlog);
      setCommentInputs({ ...commentInputs, [blogId]: "" });
      toast.success("Comment added successfully!");
    } catch (err) {
      toast.error(err.message || "Error commenting on blog");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100">
        <motion.div
          className="text-teal-600 text-lg font-semibold"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <FaPaperPlane size={32} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 p-8">
      {/* Header */}
      <motion.div
        className="text-center mb-12 relative"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-extrabold text-[#0f6f5c] tracking-tight drop-shadow-lg">
          MargDarshi Blogs
        </h1>
        <p className="text-lg text-gray-700 mt-2 font-medium">
          Share your wisdom and explore the community’s insights.
        </p>
        <motion.button
          onClick={() => setIsCreateOpen(true)}
          className="absolute top-0 right-0 px-6 py-3 bg-gradient-to-r from-[#0f6f5c] to-teal-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 flex items-center font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="mr-2" /> Create New Blog
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-center space-x-6">
          <motion.button
            onClick={() => setActiveTab("myBlogs")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === "myBlogs" ? "bg-[#0f6f5c] text-white shadow-lg" : "bg-white text-[#0f6f5c] border border-teal-200 hover:bg-teal-50"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            My Blogs
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("otherBlogs")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === "otherBlogs" ? "bg-[#0f6f5c] text-white shadow-lg" : "bg-white text-[#0f6f5c] border border-teal-200 hover:bg-teal-50"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Other Mentors' Blogs
          </motion.button>
        </div>
      </div>

      {/* Blog Content */}
      <AnimatePresence mode="wait">
        {activeTab === "myBlogs" && (
          <motion.div
            key="myBlogs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {myBlogs.length === 0 ? (
              <p className="text-center text-gray-600 text-lg font-semibold">You haven’t created any blogs yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myBlogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    onClick={() => setSelectedBlog(blog)}
                    onLike={() => handleLike(blog._id, true)}
                    isEditable={true}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "otherBlogs" && (
          <motion.div
            key="otherBlogs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {otherBlogs.length === 0 ? (
              <p className="text-center text-gray-600 text-lg font-semibold">No blogs from other mentors yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherBlogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    onClick={() => setSelectedBlog(blog)}
                    onLike={() => handleLike(blog._id, false)}
                    isEditable={false}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative border border-teal-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 text-gray-700 hover:text-teal-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes size={28} />
              </motion.button>
              <div className="flex items-center mb-6">
                <img
                  src={selectedBlog.mentorId?.profilePicture}
                  alt={selectedBlog.mentorId?.fullName || "Mentor"}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-teal-500 shadow-md object-cover"
                  onError={(e) => (e.target.src = defaultProfilePic)}
                />
                <div>
                  <p className="font-bold text-gray-900 text-xl">{selectedBlog.mentorId?.fullName || "Unknown"}</p>
                  <p className="text-sm text-gray-600">
                    {selectedBlog.mentorId?.jobTitle || "Mentor"} at {selectedBlog.mentorId?.company || "N/A"} •{" "}
                    {new Date(selectedBlog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-[#0f6f5c] mb-4">{selectedBlog.title}</h2>
              {selectedBlog.image && (
                <div className="mb-6">
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full max-h-96 object-cover rounded-lg shadow-md"
                    onError={(e) => (e.target.src = defaultProfilePic)}
                  />
                </div>
              )}
              <div data-color-mode="light" className="text-gray-800 mb-6 leading-relaxed text-lg prose max-w-none">
                <MDEditor.Markdown source={selectedBlog.content} />
              </div>
              <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-6">
                <div className="flex space-x-6 text-gray-700">
                  <motion.button
                    onClick={() => handleLike(selectedBlog._id, activeTab === "myBlogs")}
                    className={`flex items-center space-x-2 ${
                      selectedBlog.likes.some((l) => l.userId.toString() === user?._id) ? "text-red-500" : "text-gray-600"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaHeart size={20} />
                    <span className="font-medium">{selectedBlog.likes.length}</span>
                  </motion.button>
                  <span className="flex items-center space-x-2">
                    <FaComment size={20} />
                    <span className="font-medium">{selectedBlog.comments.length}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <FaShare size={20} />
                    <span className="font-medium">{selectedBlog.shares.length}</span>
                  </span>
                </div>
                {activeTab === "myBlogs" && (
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={() => setSelectedBlog({ ...selectedBlog, isEditing: true })}
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 flex items-center font-semibold transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaEdit className="mr-2" /> Edit
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(selectedBlog._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 flex items-center font-semibold transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTrash className="mr-2" /> Delete
                    </motion.button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {selectedBlog.comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 p-3 rounded-lg flex items-start space-x-3">
                    <img
                      src={comment.userId.profilePicture || defaultProfilePic}
                      alt={comment.userId.fullName || "Commenter"}
                      className="w-10 h-10 rounded-full border border-gray-300 shadow-sm object-cover"
                      onError={(e) => (e.target.src = defaultProfilePic)}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{comment.userId.fullName || "Anonymous"}</p>
                      <p className="text-gray-700 text-base">{comment.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{comment.userModel}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-start space-x-4 mt-6">
                  <img
                    src={user?.profilePicture || defaultProfilePic}
                    alt={user?.fullName || "User"}
                    className="w-10 h-10 rounded-full border border-gray-300 shadow-sm object-cover"
                    onError={(e) => (e.target.src = defaultProfilePic)}
                  />
                  <div className="flex-1 flex">
                    <input
                      type="text"
                      value={commentInputs[selectedBlog._id] || ""}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [selectedBlog._id]: e.target.value })}
                      className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm shadow-sm"
                      placeholder="Add your comment..."
                    />
                    <motion.button
                      onClick={() => handleComment(selectedBlog._id, activeTab === "myBlogs")}
                      className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-r-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaPaperPlane size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {selectedBlog?.isEditing && (
        <MentorBlogUpdate
          blog={selectedBlog}
          onBlogUpdated={handleBlogUpdated}
          onCancel={() => setSelectedBlog(null)}
        />
      )}
      {isCreateOpen && <MentorBlogCreate onBlogCreated={handleBlogCreated} onCancel={() => setIsCreateOpen(false)} />}
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ blog, onClick, onLike, isEditable }) => {
  const { user } = useAuth();

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-teal-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer h-[450px] flex flex-col"
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <img
          src={blog.mentorId?.profilePicture}
          alt={blog.mentorId?.fullName || "Mentor"}
          className="w-10 h-10 rounded-full mr-3 border-2 border-teal-400 shadow-sm object-cover"
          onError={(e) => (e.target.src = defaultProfilePic)}
        />
        <div>
          <p className="font-semibold text-gray-900">{blog.mentorId?.fullName || "Unknown"}</p>
          <p className="text-xs text-gray-500">
            {blog.mentorId?.jobTitle || "Mentor"} at {blog.mentorId?.company || "N/A"} •{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <h3 className="text-xl font-bold text-[#0f6f5c] mb-2 line-clamp-2">{blog.title}</h3>
      {blog.image && (
        <div className="mb-4">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-40 object-cover rounded-lg shadow-sm"
            onError={(e) => (e.target.src = defaultProfilePic)}
          />
        </div>
      )}
      <div
        data-color-mode="light"
        className="text-gray-700 mb-4 text-sm overflow-hidden flex-grow prose max-w-none"
        style={{ maxHeight: "100px" }}
      >
        <MDEditor.Markdown source={blog.content.substring(0, 150) + (blog.content.length > 150 ? "..." : "")} />
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Status: <span className={blog.status === "published" ? "text-green-500" : "text-yellow-500"}>{blog.status}</span>
      </p>
      <div className="flex items-center justify-between text-gray-600 mt-auto">
        <div className="flex space-x-4">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className={`flex items-center space-x-1 ${
              blog.likes.some((l) => l.userId.toString() === user?._id) ? "text-red-500" : "text-gray-500"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaHeart />
            <span>{blog.likes.length}</span>
          </motion.button>
          <span className="flex items-center space-x-1">
            <FaComment />
            <span>{blog.comments.length}</span>
          </span>
          <span className="flex items-center space-x-1">
            <FaShare />
            <span>{blog.shares.length}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MentorBlogList;