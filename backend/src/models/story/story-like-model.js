const mongoose = require("mongoose");

// Schema for the Post Like model
const storyLikeSchema = new mongoose.Schema(
  {
    story_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story", // Reference to the Post model
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
const StoryLike = mongoose.model("StoryLike", storyLikeSchema);

// Export the StoryLike model
module.exports = StoryLike;
