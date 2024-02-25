const mongoose = require("mongoose");

// Schema for the Post Like model
const postLikeSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the Post model
      required: true,
    },
    like_author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Model for the Post Like
const PostLike = mongoose.model("PostLike", postLikeSchema);

// Export the PostLike model
module.exports = { PostLike };
