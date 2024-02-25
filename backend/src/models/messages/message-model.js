const mongoose = require("mongoose");

// Define the schema for user friend requests
const messagesSchema = new mongoose.Schema(
  {
    // Sender of the friend request
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },

    // Receiver of the friend request
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },

    message: {
      type: String,
      required: true,
      maxlength: 300,
    },
  },
  { timestamps: true } // Include timestamps for createdAt and updatedAt
);

// Create and export the Message model
const Message = mongoose.model("Message", messagesSchema);

module.exports = Message;
