const mongoose = require("mongoose");

// Define the schema for the Story View model
const storyViewSchema = new mongoose.Schema(
  {
    story_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
    view_author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Model for the Story View
const StoryView = mongoose.model("StoryView", storyViewSchema);

module.exports = StoryView;
