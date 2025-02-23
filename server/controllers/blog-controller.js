// controllers/blog-controller.js
const Blog = require("../models/blog-model");
const Mentor = require("../models/mentor-model");

// Create a new blog (Mentor only)
const createBlog = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const mentorId = req.user._id;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const blog = new Blog({
      title,
      content,
      mentorId,
      status: status || "draft", // Default to draft if not provided
    });

    await blog.save();

    // Optionally update mentor's blogs array if you added the field
    await Mentor.findByIdAndUpdate(mentorId, { $push: { blogs: blog._id } });

    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a blog (Mentor only, their own blog)
const updateBlog = async (req, res) => {
  try {
    const { blogId, title, content, status } = req.body;
    const mentorId = req.user._id;

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

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a blog (Mentor only, their own blog)
const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const mentorId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.mentorId.toString() !== mentorId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this blog" });
    }

    await Blog.deleteOne({ _id: blogId });

    // Optionally remove from mentor's blogs array if you added the field
    await Mentor.findByIdAndUpdate(mentorId, { $pull: { blogs: blogId } });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all blogs by a specific mentor (Mentor only for their own, or any authenticated user)
const getMentorBlogs = async (req, res) => {
  try {
    const mentorId = req.params.mentorId || req.user._id; // Default to logged-in mentor if no ID provided

    const blogs = await Blog.find({ mentorId }).populate("mentorId", "fullName");
    res.status(200).json({ blogs });
  } catch (err) {
    console.error("Error fetching mentor blogs:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all published blogs (Accessible to mentees and mentors)
const getAllPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" }).populate("mentorId", "fullName jobTitle company");
    res.status(200).json({ blogs });
  } catch (err) {
    console.error("Error fetching all published blogs:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getMentorBlogs,
  getAllPublishedBlogs,
};