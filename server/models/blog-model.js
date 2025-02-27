// const mongoose = require("mongoose");

// const commentSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     refPath: "comments.userModel",
//     required: true,
//   },
//   userModel: {
//     type: String,
//     enum: ["Mentor", "Mentee"],
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const blogSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     mentorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Mentor",
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["draft", "published"],
//       default: "draft",
//     },
//     likes: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           refPath: "likes.userModel",
//         },
//         userModel: {
//           type: String,
//           enum: ["Mentor", "Mentee"],
//         },
//       },
//     ],
//     comments: [commentSchema],
//     shares: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           refPath: "shares.userModel",
//         },
//         userModel: {
//           type: String,
//           enum: ["Mentor", "Mentee"],
//         },
//         sharedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     updatedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// // Update `updatedAt` before saving if modified
// blogSchema.pre("save", function (next) {
//   if (this.isModified()) {
//     this.updatedAt = Date.now();
//   }
//   next();
// });

// const Blog = mongoose.model("Blog", blogSchema);
// module.exports = Blog;

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "comments.userModel",
    required: true,
  },
  userModel: {
    type: String,
    enum: ["Mentor", "Mentee"],
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    image: {
      type: String, // Store the filename of the uploaded image
      default: null,
    },
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "likes.userModel",
        },
        userModel: {
          type: String,
          enum: ["Mentor", "Mentee"],
        },
      },
    ],
    comments: [commentSchema],
    shares: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "shares.userModel",
        },
        userModel: {
          type: String,
          enum: ["Mentor", "Mentee"],
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;