const mongoose = require("mongoose");

// Define the schema for the Comment model
const StoryCommentSchema = new mongoose.Schema(
  {
    // Author's ID associated with the comment
    author_id: { type: String, required: true },

    // Post's ID to which the comment belongs
    story_id: { type: String, required: true },

    // The actual comment content
    comment: { type: String, required: true, maxlength: 70 }, // Adding max length validation
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create the Comment model based on the StoryCommentSchema
const StoryCommentModel = mongoose.model("StoryComment", StoryCommentSchema);

// Export the Comment model for use in other parts of the application
module.exports = StoryCommentModel;
