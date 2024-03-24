const mongoose = require("mongoose");

// Enum representing different friend list types
const FriendList = {
  Friend: "Friend",
  CloseFriend: "CloseFriend",
  // Favorite: "Favorite",
};

// Define the schema for the Post model
const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      maxlength: 500,
    },
    media: {
      type: [
        {
          url: String,
          public_id: String,
        },
      ],
      validate: {
        validator: function (mediaArray) {
          // Custom validator to ensure media array length is 0 or 1
          return mediaArray.length <= 1;
        },
        message: "Media array can have at most 1 file.",
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    list: {
      type: String,
      enum: Object.values(FriendList),
      required: true,
      default: FriendList.Friend,
    },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// Create the Post model from the schema
const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
