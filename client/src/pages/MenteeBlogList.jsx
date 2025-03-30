// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAuth } from "../store/auth";
// import { toast } from "react-toastify";
// import { FaHeart, FaComment, FaShare, FaPaperPlane, FaTimes } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import defaultProfilePic from "../assets/profile2.jpg";
// import MDEditor from "@uiw/react-md-editor";

// const MenteeBlogList = () => {
//   const { authorizationToken, user, logoutUser, isLoading } = useAuth();
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [commentInputs, setCommentInputs] = useState({});
//   const [selectedBlog, setSelectedBlog] = useState(null);
//   const navigate = useNavigate();
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   useEffect(() => {
//     if (!isLoading && authorizationToken) {
//       fetchBlogs();
//     }
//   }, [authorizationToken, isLoading]);

//   const fetchBlogs = async () => {
//     setLoading(true);
//     try {
//       if (!authorizationToken) throw new Error("No authorization token available");
//       const response = await fetch(`${backendUrl}/api/auth/blogs/allm`, {
//         method: "GET",
//         headers: { Authorization: authorizationToken },
//       });
//       if (!response.ok) {
//         if (response.status === 401) {
//           logoutUser();
//           navigate("/mentee-login");
//           throw new Error("Session expired, please log in again");
//         }
//         throw new Error("Failed to fetch blogs");
//       }
//       const data = await response.json();
//       const updatedBlogs = data.blogs.map((blog) => ({
//         ...blog,
//         mentorId: {
//           ...blog.mentorId,
//           profilePicture: blog.mentorId?.profilePicture
//             ? `${backendUrl}/api/auth/images/${blog.mentorId.profilePicture}`
//             : defaultProfilePic,
//         },
//         image: blog.image ? `${backendUrl}/uploads/blogs/${blog.image}` : null, // Updated to match backend path
//         comments: blog.comments.map((comment) => ({
//           ...comment,
//           userId: {
//             _id: comment.userId?._id || comment.userId,
//             fullName: comment.userId?.fullName || "Anonymous",
//             profilePicture: comment.userId?.profilePicture
//               ? `${backendUrl}/api/auth/images/${comment.userId.profilePicture}`
//               : defaultProfilePic,
//           },
//         })),
//       }));
//       setBlogs(updatedBlogs || []);
//     } catch (err) {
//       toast.error(err.message || "Error fetching blogs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLike = async (blogId) => {
//     if (!authorizationToken || isLoading) {
//       toast.error("Please wait until authenticated or log in to like");
//       return;
//     }
//     try {
//       const response = await fetch(`${backendUrl}/api/auth/blogs/likem`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify({ blogId }),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           logoutUser();
//           navigate("/mentee-login");
//           throw new Error(errorData.message || "Session expired, please log in again");
//         }
//         throw new Error(errorData.message || "Failed to like blog");
//       }
//       const data = await response.json();
//       const updatedBlog = {
//         ...data.blog,
//         image: data.blog.image ? `${backendUrl}/uploads/blogs/${data.blog.image}` : null, // Preserve image URL
//       };
//       setBlogs(blogs.map((blog) => (blog._id === blogId ? updatedBlog : blog)));
//       if (selectedBlog && selectedBlog._id === blogId) setSelectedBlog(updatedBlog);
//       toast.success(data.message);
//     } catch (err) {
//       toast.error(err.message || "Error liking blog");
//     }
//   };

//   const handleComment = async (blogId) => {
//     const content = commentInputs[blogId]?.trim();
//     if (!content) {
//       toast.error("Comment cannot be empty");
//       return;
//     }
//     if (!authorizationToken || isLoading) {
//       toast.error("Please wait until authenticated or log in to comment");
//       return;
//     }

//     try {
//       const response = await fetch(`${backendUrl}/api/auth/blogs/commentm`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify({ blogId, content }),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           logoutUser();
//           navigate("/mentee-login");
//           throw new Error(errorData.message || "Session expired, please log in again");
//         }
//         throw new Error(errorData.message || "Failed to comment on blog");
//       }
//       const data = await response.json();
//       const updatedBlogs = blogs.map((blog) =>
//         blog._id === blogId
//           ? {
//               ...data.blog,
//               mentorId: {
//                 ...data.blog.mentorId,
//                 profilePicture: data.blog.mentorId?.profilePicture
//                   ? `${backendUrl}/api/auth/images/${data.blog.mentorId.profilePicture}`
//                   : defaultProfilePic,
//               },
//               image: data.blog.image ? `${backendUrl}/uploads/blogs/${data.blog.image}` : null,
//               comments: data.blog.comments.map((comment) => ({
//                 ...comment,
//                 userId: {
//                   _id: comment.userId?._id || comment.userId,
//                   fullName: comment.userId?.fullName || user?.fullName || "Anonymous",
//                   profilePicture: comment.userId?.profilePicture
//                     ? `${backendUrl}/api/auth/images/${comment.userId.profilePicture}`
//                     : user?.profilePicture || defaultProfilePic,
//                 },
//               })),
//             }
//           : blog
//       );
//       setBlogs(updatedBlogs);
//       if (selectedBlog && selectedBlog._id === blogId) setSelectedBlog(updatedBlogs.find((b) => b._id === blogId));
//       setCommentInputs({ ...commentInputs, [blogId]: "" });
//       toast.success("Comment added successfully!");
//     } catch (err) {
//       toast.error(err.message || "Error commenting on blog");
//     }
//   };

//   const handleShare = async (blogId) => {
//     if (!authorizationToken || isLoading) {
//       toast.error("Please wait until authenticated or log in to share");
//       return;
//     }
//     try {
//       const response = await fetch(`${backendUrl}/api/auth/blogs/sharem`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify({ blogId }),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           logoutUser();
//           navigate("/mentee-login");
//           throw new Error(errorData.message || "Session expired, please log in again");
//         }
//         throw new Error(errorData.message || "Failed to share blog");
//       }
//       const data = await response.json();
//       const updatedBlog = {
//         ...data.blog,
//         image: data.blog.image ? `${backendUrl}/uploads/blogs/${data.blog.image}` : null, // Preserve image URL
//       };
//       setBlogs(blogs.map((blog) => (blog._id === blogId ? updatedBlog : blog)));
//       if (selectedBlog && selectedBlog._id === blogId) setSelectedBlog(updatedBlog);
//       toast.success("Blog shared successfully!");
//     } catch (err) {
//       toast.error(err.message || "Error sharing blog");
//     }
//   };

//   if (isLoading || loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-blue-50">
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

//   if (!user || !authorizationToken) {
//     navigate("/mentee-login");
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-blue-50 p-8">
//       {/* Header */}
//       <motion.div
//         className="text-center mb-12"
//         initial={{ opacity: 0, y: 0 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.1 }}
//       >
//         <h1 className="text-5xl font-extrabold text-[#0f6f5c] tracking-tight drop-shadow-lg">
//           MargDarshi Blog Hub
//         </h1>
//         <p className="text-lg text-gray-700 mt-2 font-medium">
//           Discover vibrant insights from your mentors.
//         </p>
//       </motion.div>

//       {/* Blog Feed */}
//       <div className="max-w-3xl mx-auto">
//         {blogs.length === 0 ? (
//           <p className="text-center text-gray-600 text-lg font-semibold">
//             No blogs available yet. Stay tuned for inspiring updates!
//           </p>
//         ) : (
//           <div className="space-y-8">
//             {blogs.map((blog) => (
//               <motion.div
//                 key={blog._id}
//                 className="bg-white rounded-xl shadow-lg border border-teal-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer h-[450px] flex flex-col"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 onClick={() => setSelectedBlog(blog)}
//               >
//                 <div className="flex items-center mb-4">
//                   <img
//                     src={blog.mentorId?.profilePicture}
//                     alt={blog.mentorId?.fullName || "Mentor"}
//                     className="w-12 h-12 rounded-full mr-3 border-2 border-teal-400 shadow-sm object-cover"
//                     onError={(e) => (e.target.src = defaultProfilePic)}
//                   />
//                   <div>
//                     <p className="font-semibold text-gray-900 text-lg">{blog.mentorId?.fullName || "Unknown"}</p>
//                     <p className="text-sm text-gray-600">
//                       {blog.mentorId?.jobTitle || "Mentor"} at {blog.mentorId?.company || "N/A"} •{" "}
//                       {new Date(blog.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//                 <h3 className="text-xl font-bold text-[#0f6f5c] mb-2 line-clamp-2">{blog.title}</h3>
//                 {blog.image && (
//                   <div className="mb-4">
//                     <img
//                       src={blog.image}
//                       alt={blog.title}
//                       className="w-full h-40 object-cover rounded-lg shadow-sm"
//                       onError={(e) => (e.target.src = defaultProfilePic)}
//                     />
//                   </div>
//                 )}
//                 <div
//                   data-color-mode="light"
//                   className="text-gray-700 mb-4 text-sm overflow-hidden flex-grow prose max-w-none"
//                   style={{ maxHeight: "100px" }}
//                 >
//                   <MDEditor.Markdown
//                     source={blog.content.substring(0, 150) + (blog.content.length > 150 ? "..." : "")}
//                   />
//                 </div>
//                 <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-auto">
//                   <div className="flex space-x-6 text-gray-600">
//                     <motion.button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleLike(blog._id);
//                       }}
//                       className={`flex items-center space-x-1 ${
//                         blog.likes.some((l) => l.userId.toString() === user?._id) ? "text-red-500" : "text-gray-500"
//                       }`}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <FaHeart />
//                       <span>{blog.likes.length}</span>
//                     </motion.button>
//                     <span className="flex items-center space-x-1">
//                       <FaComment />
//                       <span>{blog.comments.length}</span>
//                     </span>
//                     <motion.button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleShare(blog._id);
//                       }}
//                       className="flex items-center space-x-1 text-gray-500"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <FaShare />
//                       <span>{blog.shares.length}</span>
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Full Blog Modal */}
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
//                   className="w-14 h-14 rounded-full mr-4 border-2 border-teal-500 shadow-md object-cover"
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
//               {selectedBlog.image && (
//                 <div className="mb-6">
//                   <img
//                     src={selectedBlog.image}
//                     alt={selectedBlog.title}
//                     className="w-full max-h-96 object-cover rounded-lg shadow-md"
//                     onError={(e) => (e.target.src = defaultProfilePic)}
//                   />
//                 </div>
//               )}
//               <div data-color-mode="light" className="text-gray-800 mb-6 leading-relaxed text-lg prose max-w-none">
//                 <MDEditor.Markdown source={selectedBlog.content} />
//               </div>
//               <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-6">
//                 <div className="flex space-x-8 text-gray-700">
//                   <motion.button
//                     onClick={() => handleLike(selectedBlog._id)}
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
//                   <motion.button
//                     onClick={() => handleShare(selectedBlog._id)}
//                     className="flex items-center space-x-2 text-gray-600"
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     <FaShare size={20} />
//                     <span className="font-medium">{selectedBlog.shares.length}</span>
//                   </motion.button>
//                 </div>
//               </div>
//               <div className="space-y-6">
//                 {selectedBlog.comments.map((comment) => (
//                   <div key={comment._id} className="flex items-start space-x-4">
//                     <img
//                       src={comment.userId.profilePicture || defaultProfilePic}
//                       alt={comment.userId.fullName || "Commenter"}
//                       className="w-10 h-10 rounded-full border border-gray-300 shadow-sm object-cover"
//                       onError={(e) => (e.target.src = defaultProfilePic)}
//                     />
//                     <div className="bg-gray-100 p-4 rounded-lg flex-1 shadow-sm">
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
//                       onClick={() => handleComment(selectedBlog._id)}
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
//     </div>
//   );
// };

// export default MenteeBlogList;

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FaHeart, FaComment, FaShare, FaPaperPlane, FaTimes, FaSort, FaEllipsisH, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../assets/profile2.jpg";
import MDEditor from "@uiw/react-md-editor";
import TimeAgo from "react-timeago";
import { FiArrowUp } from "react-icons/fi";

const MenteeBlogList = () => {
  const { authorizationToken, user, logoutUser, isLoading } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [commentInputs, setCommentInputs] = useState({});
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const blogsPerPage = 5;
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isLoading && authorizationToken) {
      fetchBlogs();
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [authorizationToken, isLoading, sortBy, page]);

  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      if (!authorizationToken) throw new Error("No authorization token available");
      const response = await fetch(
        `${backendUrl}/api/auth/blogs/allm?page=${page}&limit=${blogsPerPage}&sort=${sortBy}`,
        {
          method: "GET",
          headers: { Authorization: authorizationToken },
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          logoutUser();
          navigate("/mentee-login");
          throw new Error("Session expired, please log in again");
        }
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();
      const updatedBlogs = data.blogs.map((blog) => ({
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
      setBlogs(page === 1 ? updatedBlogs : [...blogs, ...updatedBlogs]);
      setHasMore(data.blogs.length === blogsPerPage);
    } catch (err) {
      toast.error(err.message || "Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (blogId) => {
    if (!authorizationToken || isLoading) return toast.error("Please log in to like");
    try {
      const response = await fetch(`${backendUrl}/api/auth/blogs/likem`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authorizationToken },
        body: JSON.stringify({ blogId }),
      });
      if (!response.ok) throw new Error("Failed to like blog");
      const data = await response.json();
      const updatedBlog = { ...data.blog, image: data.blog.image ? `${backendUrl}/uploads/blogs/${data.blog.image}` : null };
      setBlogs(blogs.map((blog) => (blog._id === blogId ? updatedBlog : blog)));
      if (selectedBlog && selectedBlog._id === blogId) setSelectedBlog(updatedBlog);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || "Error liking blog");
    }
  };

  const handleComment = async (blogId) => {
    const content = commentInputs[blogId]?.trim();
    if (!content) return toast.error("Comment cannot be empty");
    if (!authorizationToken || isLoading) return toast.error("Please log in to comment");

    try {
      const response = await fetch(`${backendUrl}/api/auth/blogs/commentm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authorizationToken },
        body: JSON.stringify({ blogId, content }),
      });
      if (!response.ok) throw new Error("Failed to comment on blog");
      const data = await response.json();
      const updatedBlogs = blogs.map((blog) =>
        blog._id === blogId
          ? {
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
                    : defaultProfilePic,
                },
              })),
            }
          : blog
      );
      setBlogs(updatedBlogs);
      if (selectedBlog && selectedBlog._id === blogId) setSelectedBlog(updatedBlogs.find((b) => b._id === blogId));
      setCommentInputs({ ...commentInputs, [blogId]: "" });
      toast.success("Comment posted!");
    } catch (err) {
      toast.error(err.message || "Error commenting on blog");
    }
  };

  const handleShare = async (blogId) => {
    if (!authorizationToken || isLoading) return toast.error("Please log in to share");
    try {
      const response = await fetch(`${backendUrl}/api/auth/blogs/sharem`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authorizationToken },
        body: JSON.stringify({ blogId }),
      });
      if (!response.ok) throw new Error("Failed to share blog");
      const data = await response.json();
      const updatedBlog = { ...data.blog, image: data.blog.image ? `${backendUrl}/uploads/blogs/${data.blog.image}` : null };
      setBlogs(blogs.map((blog) => (blog._id === blogId ? updatedBlog : blog)));
      if (selectedBlog && selectedBlog._id === blogId) setSelectedBlog(updatedBlog);
      toast.success("Blog shared!");
    } catch (err) {
      toast.error(err.message || "Error sharing blog");
    }
  };

  const toggleBookmark = (blogId) => {
    setIsBookmarked(prev => ({
      ...prev,
      [blogId]: !prev[blogId]
    }));
    // Here you would typically make an API call to save the bookmark
    toast.success(isBookmarked[blogId] ? "Removed from bookmarks" : "Saved to bookmarks");
  };

  const handleImageError = (e) => {
    e.target.src = defaultProfilePic;
  };

  if (isLoading || loading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {Array(3).fill().map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-4">
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user || !authorizationToken) {
    navigate("/mentee-login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8" ref={containerRef}>
      {/* Scroll to top button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-teal-600 text-white p-3 rounded-full shadow-lg z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiArrowUp size={20} />
        </motion.button>
      )}

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              Mentor Insights
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Learn from experienced mentors in your field
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                  setBlogs([]);
                }}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
              >
                <option value="latest">Latest Posts</option>
                <option value="mostLiked">Most Popular</option>
              </select>
              <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Blog Feed */}
      <div className="max-w-4xl mx-auto space-y-6">
        {blogs.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center"
          >
            <h3 className="text-lg font-medium text-gray-700 mb-2">No blogs available yet</h3>
            <p className="text-gray-500 text-sm">
              Check back later or follow more mentors to see their posts
            </p>
          </motion.div>
        ) : (
          blogs.map((blog) => (
            <motion.div
              key={blog._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -2 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={blog.mentorId?.profilePicture}
                      alt={blog.mentorId?.fullName || "Mentor"}
                      className="w-10 h-10 rounded-full mr-3 border border-gray-200 object-cover"
                      onError={handleImageError}
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {blog.mentorId?.fullName || "Unknown"}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span>{blog.mentorId?.jobTitle || "Mentor"}</span>
                        <span>•</span>
                        <TimeAgo date={blog.createdAt} />
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(blog._id);
                    }}
                    className="text-gray-400 hover:text-teal-500 transition-colors"
                  >
                    {isBookmarked[blog._id] ? (
                      <FaBookmark className="text-teal-500" />
                    ) : (
                      <FaRegBookmark />
                    )}
                  </button>
                </div>

                <div 
                  className="mb-4 cursor-pointer" 
                  onClick={() => setSelectedBlog(blog)}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div 
                    data-color-mode="light" 
                    className="text-gray-600 text-sm sm:text-base line-clamp-3 prose max-w-none"
                  >
                    <MDEditor.Markdown source={blog.content} />
                  </div>
                </div>

                {blog.image && (
                  <div 
                    className="mb-4 rounded-lg overflow-hidden cursor-pointer" 
                    onClick={() => setSelectedBlog(blog)}
                  >
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-48 sm:h-64 object-cover hover:scale-[1.01] transition-transform duration-300"
                      onError={handleImageError}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex space-x-4 text-gray-500">
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); handleLike(blog._id); }}
                      className={`flex items-center space-x-1 text-sm ${blog.likes.some((l) => l.userId.toString() === user?._id) ? "text-red-500" : "hover:text-red-500"}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaHeart className="text-base" />
                      <span>{blog.likes.length}</span>
                    </motion.button>
                    <button 
                      className="flex items-center space-x-1 text-sm hover:text-teal-500"
                      onClick={() => setSelectedBlog(blog)}
                    >
                      <FaComment className="text-base" />
                      <span>{blog.comments.length}</span>
                    </button>
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); handleShare(blog._id); }}
                      className="flex items-center space-x-1 text-sm hover:text-teal-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaShare className="text-base" />
                      <span>{blog.shares.length}</span>
                    </motion.button>
                  </div>
                  <button 
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    onClick={() => setSelectedBlog(blog)}
                  >
                    Read more
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
        {hasMore && (
          <motion.button
            onClick={() => setPage(page + 1)}
            className="mt-6 w-full sm:w-auto mx-auto block px-6 py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition-all duration-300 text-sm font-medium flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              "Load More Posts"
            )}
          </motion.button>
        )}
      </div>

      {/* Full Blog Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-y-auto flex-1">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={selectedBlog.mentorId?.profilePicture}
                      alt={selectedBlog.mentorId?.fullName || "Mentor"}
                      className="w-10 h-10 rounded-full mr-3 border border-gray-200 object-cover"
                      onError={handleImageError}
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{selectedBlog.mentorId?.fullName || "Unknown"}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span>{selectedBlog.mentorId?.jobTitle || "Mentor"}</span>
                        <span>•</span>
                        <TimeAgo date={selectedBlog.createdAt} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedBlog.title}</h2>
                  
                  {selectedBlog.image && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <img
                        src={selectedBlog.image}
                        alt={selectedBlog.title}
                        className="w-full h-auto max-h-96 object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                  
                  <div 
                    data-color-mode="light" 
                    className="text-gray-700 mb-6 text-base prose max-w-none"
                  >
                    <MDEditor.Markdown source={selectedBlog.content} />
                  </div>
                  
                  {/* Engagement Metrics */}
                  <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-6">
                    <div className="flex space-x-6 text-gray-600">
                      <motion.button
                        onClick={() => handleLike(selectedBlog._id)}
                        className={`flex items-center space-x-1 ${selectedBlog.likes.some((l) => l.userId.toString() === user?._id) ? "text-red-500" : "hover:text-red-500"}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaHeart />
                        <span>{selectedBlog.likes.length} Likes</span>
                      </motion.button>
                      <span className="flex items-center space-x-1">
                        <FaComment />
                        <span>{selectedBlog.comments.length} Comments</span>
                      </span>
                      <motion.button
                        onClick={() => handleShare(selectedBlog._id)}
                        className="flex items-center space-x-1 hover:text-teal-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaShare />
                        <span>{selectedBlog.shares.length} Shares</span>
                      </motion.button>
                    </div>
                    <button 
                      onClick={() => toggleBookmark(selectedBlog._id)}
                      className="text-gray-500 hover:text-teal-500 flex items-center space-x-1"
                    >
                      {isBookmarked[selectedBlog._id] ? (
                        <>
                          <FaBookmark className="text-teal-500" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <FaRegBookmark />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Comments Section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800">Comments ({selectedBlog.comments.length})</h3>
                    
                    {selectedBlog.comments.length > 0 ? (
                      selectedBlog.comments.map((comment) => (
                        <motion.div 
                          key={comment._id} 
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <img
                            src={comment.userId.profilePicture}
                            alt={comment.userId.fullName || "Commenter"}
                            className="w-8 h-8 rounded-full border border-gray-200 object-cover flex-shrink-0"
                            onError={handleImageError}
                          />
                          <div className="bg-gray-50 p-3 rounded-lg flex-1 shadow-sm">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-semibold text-gray-900">
                                {comment.userId.fullName || "Anonymous"}
                              </p>
                              <span className="text-xs text-gray-400">
                                <TimeAgo date={comment.createdAt} />
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-sm">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Comment Input */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={user?.profilePicture || defaultProfilePic}
                    alt={user?.fullName || "User"}
                    className="w-8 h-8 rounded-full border border-gray-200 object-cover flex-shrink-0"
                    onError={handleImageError}
                  />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={commentInputs[selectedBlog._id] || ""}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [selectedBlog._id]: e.target.value })}
                      className="w-full p-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Write a comment..."
                      onKeyPress={(e) => e.key === 'Enter' && handleComment(selectedBlog._id)}
                    />
                    <motion.button
                      onClick={() => handleComment(selectedBlog._id)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={!commentInputs[selectedBlog._id]?.trim()}
                    >
                      <IoMdSend size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenteeBlogList;