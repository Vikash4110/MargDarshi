// const Blog = require("../models/blog-model");
// const Mentor = require("../models/mentor-model");
// const Mentee = require("../models/mentee-model");

// // Create a new blog (Mentor only)
// const createBlog = async (req, res) => {
//   try {
//     const { title, content, status } = req.body;
//     const mentorId = req.user._id;

//     if (!title || !content) {
//       return res.status(400).json({ message: "Title and content are required" });
//     }

//     const blog = new Blog({
//       title,
//       content,
//       mentorId,
//       status: status || "draft",
//     });

//     await blog.save();
//     await Mentor.findByIdAndUpdate(mentorId, { $push: { blogs: blog._id } });

//     res.status(201).json({ message: "Blog created successfully", blog });
//   } catch (err) {
//     console.error("Error creating blog:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

// // Update a blog (Mentor only, their own blog)
// const updateBlog = async (req, res) => {
//   try {
//     const { blogId, title, content, status } = req.body;
//     const mentorId = req.user._id;

//     if (!blogId) {
//       return res.status(400).json({ message: "Blog ID is required" });
//     }

//     const blog = await Blog.findById(blogId);
//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     if (blog.mentorId.toString() !== mentorId.toString()) {
//       return res.status(403).json({ message: "Unauthorized to update this blog" });
//     }

//     if (title) blog.title = title;
//     if (content) blog.content = content;
//     if (status) blog.status = status;

//     await blog.save();
//     res.status(200).json({ message: "Blog updated successfully", blog });
//   } catch (err) {
//     console.error("Error updating blog:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

// // Delete a blog (Mentor only, their own blog)
// const deleteBlog = async (req, res) => {
//   try {
//     const { blogId } = req.params;
//     const mentorId = req.user._id;

//     if (!blogId) {
//       return res.status(400).json({ message: "Blog ID is required" });
//     }

//     const blog = await Blog.findById(blogId);
//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     if (blog.mentorId.toString() !== mentorId.toString()) {
//       return res.status(403).json({ message: "Unauthorized to delete this blog" });
//     }

//     await Blog.deleteOne({ _id: blogId });
//     await Mentor.findByIdAndUpdate(mentorId, { $pull: { blogs: blogId } });

//     res.status(200).json({ message: "Blog deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting blog:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

// // Get all blogs by a specific mentor
// const getMentorBlogs = async (req, res) => {
//   try {
//     const mentorId = req.params.mentorId || req.user._id;
//     const blogs = await Blog.find({ mentorId })
//       .populate("mentorId", "fullName jobTitle company profilePicture")
//       .populate({
//         path: "comments.userId",
//         select: "fullName profilePicture",
//         model: "Mentee", // Assuming comments are mostly from mentees; adjust if needed
//       });
//     res.status(200).json({ blogs });
//   } catch (err) {
//     console.error("Error fetching mentor blogs:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

// // Get all published blogs
// const getAllPublishedBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find({ status: "published" })
//       .populate("mentorId", "fullName jobTitle company profilePicture")
//       .populate({
//         path: "comments.userId",
//         select: "fullName profilePicture",
//         model: "Mentee", // Populate mentee data for comments
//       });
//     res.status(200).json({ blogs });
//   } catch (err) {
//     console.error("Error fetching published blogs:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

// // Like a blog
// const likeBlog = async (req, res) => {
//   try {
//     const { blogId } = req.body;
//     const userId = req.user._id;
//     const userModel = req.user.role === "mentor" ? "Mentor" : "Mentee";

//     if (!blogId) {
//       return res.status(400).json({ message: "Blog ID is required" });
//     }

//     const blog = await Blog.findById(blogId);
//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     const alreadyLiked = blog.likes.some(
//       (like) => like.userId.toString() === userId.toString() && like.userModel === userModel
//     );

//     if (alreadyLiked) {
//       blog.likes = blog.likes.filter(
//         (like) => !(like.userId.toString() === userId.toString() && like.userModel === userModel)
//       );
//     } else {
//       blog.likes.push({ userId, userModel });
//     }

//     await blog.save();
//     res.status(200).json({ message: alreadyLiked ? "Blog unliked" : "Blog liked", blog });
//   } catch (err) {
//     console.error("Error liking blog:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

// // Comment on a blog
// const commentBlog = async (req, res) => {
//   try {
//     const { blogId, content } = req.body;
//     const userId = req.user._id;
//     const userModel = req.user.role === "mentor" ? "Mentor" : "Mentee";

//     if (!blogId || !content) {
//       return res.status(400).json({ message: "Blog ID and content are required" });
//     }

//     const blog = await Blog.findById(blogId);
//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     blog.comments.push({ userId, userModel, content });
//     await blog.save();

//     // Populate the newly added comment with user data
//     const updatedBlog = await Blog.findById(blogId)
//       .populate("mentorId", "fullName jobTitle company profilePicture")
//       .populate({
//         path: "comments.userId",
//         select: "fullName profilePicture",
//         model: userModel === "Mentor" ? "Mentor" : "Mentee",
//       });

//     res.status(201).json({ message: "Comment added successfully", blog: updatedBlog });
//   } catch (err) {
//     console.error("Error commenting on blog:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

// // Share a blog
// const shareBlog = async (req, res) => {
//   try {
//     const { blogId } = req.body;
//     const userId = req.user._id;
//     const userModel = req.user.role === "mentor" ? "Mentor" : "Mentee";

//     if (!blogId) {
//       return res.status(400).json({ message: "Blog ID is required" });
//     }

//     const blog = await Blog.findById(blogId);
//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     const alreadyShared = blog.shares.some(
//       (share) => share.userId.toString() === userId.toString() && share.userModel === userModel
//     );

//     if (!alreadyShared) {
//       blog.shares.push({ userId, userModel });
//       await blog.save();
//     }

//     res.status(200).json({ message: "Blog shared successfully", blog });
//   } catch (err) {
//     console.error("Error sharing blog:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

// module.exports = {
//   createBlog,
//   updateBlog,
//   deleteBlog,
//   getMentorBlogs,
//   getAllPublishedBlogs,
//   likeBlog,
//   commentBlog,
//   shareBlog,
// };

const Blog = require("../models/blog-model");
const Mentor = require("../models/mentor-model");
const Mentee = require("../models/mentee-model");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/blogs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create a new blog (Mentor only) with image upload
const createBlog = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const mentorId = req.user._id;
    const image = req.file ? req.file.filename : null; // Assuming multer is used for file upload

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const blog = new Blog({
      title,
      content,
      mentorId,
      status: status || "draft",
      image,
    });

    await blog.save();
    await Mentor.findByIdAndUpdate(mentorId, { $push: { blogs: blog._id } });

    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Update a blog (Mentor only, their own blog) with optional image update
const updateBlog = async (req, res) => {
  try {
    const { blogId, title, content, status } = req.body;
    const mentorId = req.user._id;
    const image = req.file ? req.file.filename : null;

    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.mentorId.toString() !== mentorId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this blog" });
    }

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (status) blog.status = status;
    if (image) {
      // Remove old image if it exists
      if (blog.image) {
        fs.unlinkSync(path.join(uploadDir, blog.image));
      }
      blog.image = image;
    }

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Delete a blog (Mentor only, their own blog)
const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const mentorId = req.user._id;

    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.mentorId.toString() !== mentorId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this blog" });
    }

    if (blog.image) {
      fs.unlinkSync(path.join(uploadDir, blog.image));
    }

    await Blog.deleteOne({ _id: blogId });
    await Mentor.findByIdAndUpdate(mentorId, { $pull: { blogs: blogId } });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get all blogs by a specific mentor
const getMentorBlogs = async (req, res) => {
  try {
    const mentorId = req.params.mentorId || req.user._id;
    const blogs = await Blog.find({ mentorId })
      .populate("mentorId", "fullName jobTitle company profilePicture")
      .populate({
        path: "comments.userId",
        select: "fullName profilePicture",
        model: "Mentee",
      })
      .populate({
        path: "comments.userId",
        select: "fullName profilePicture",
        model: "Mentor",
      });
    res.status(200).json({ blogs });
  } catch (err) {
    console.error("Error fetching mentor blogs:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get all published blogs
const getAllPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" })
      .populate("mentorId", "fullName jobTitle company profilePicture")
      .populate({
        path: "comments.userId",
        select: "fullName profilePicture",
        model: "Mentee",
      })
      .populate({
        path: "comments.userId",
        select: "fullName profilePicture",
        model: "Mentor",
      });
    res.status(200).json({ blogs });
  } catch (err) {
    console.error("Error fetching published blogs:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Like a blog
const likeBlog = async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.user._id;
    const userModel = req.user.role === "mentor" ? "Mentor" : "Mentee";

    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const alreadyLiked = blog.likes.some(
      (like) => like.userId.toString() === userId.toString() && like.userModel === userModel
    );

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (like) => !(like.userId.toString() === userId.toString() && like.userModel === userModel)
      );
    } else {
      blog.likes.push({ userId, userModel });
    }

    await blog.save();
    res.status(200).json({ message: alreadyLiked ? "Blog unliked" : "Blog liked", blog });
  } catch (err) {
    console.error("Error liking blog:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Comment on a blog
const commentBlog = async (req, res) => {
  try {
    const { blogId, content } = req.body;
    const userId = req.user._id;
    const userModel = req.user.role === "mentor" ? "Mentor" : "Mentee";

    if (!blogId || !content) {
      return res.status(400).json({ message: "Blog ID and content are required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments.push({ userId, userModel, content });
    await blog.save();

    const updatedBlog = await Blog.findById(blogId)
      .populate("mentorId", "fullName jobTitle company profilePicture")
      .populate({
        path: "comments.userId",
        select: "fullName profilePicture",
        model: userModel === "Mentor" ? "Mentor" : "Mentee",
      });

    res.status(201).json({ message: "Comment added successfully", blog: updatedBlog });
  } catch (err) {
    console.error("Error commenting on blog:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Share a blog
const shareBlog = async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.user._id;
    const userModel = req.user.role === "mentor" ? "Mentor" : "Mentee";

    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const alreadyShared = blog.shares.some(
      (share) => share.userId.toString() === userId.toString() && share.userModel === userModel
    );

    if (!alreadyShared) {
      blog.shares.push({ userId, userModel });
      await blog.save();
    }

    res.status(200).json({ message: "Blog shared successfully", blog });
  } catch (err) {
    console.error("Error sharing blog:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getMentorBlogs,
  getAllPublishedBlogs,
  likeBlog,
  commentBlog,
  shareBlog,
};