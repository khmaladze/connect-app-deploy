const mongoose = require("mongoose");

// Enum for friend list types
const FriendListType = {
  Friend: "Friend",
  CloseFriend: "CloseFriend",
  Favorite: "Favorite",
};

// Enum for friend request statuses
const FriendRequestStatus = {
  Pending: "pending",
  Accepted: "accepted",
  Rejected: "rejected",
};

// Define the schema for user friend requests
const userFriendAddSchema = new mongoose.Schema(
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

    // Type of friendship (using the FriendListType enum)
    friend_list: {
      type: String,
      enum: Object.values(FriendListType),
      default: FriendListType.Friend,
    },

    // Status of the friend request (using the FriendRequestStatus enum)
    status: {
      type: String,
      enum: Object.values(FriendRequestStatus),
      default: FriendRequestStatus.Pending,
    },
  },
  { timestamps: true } // Include timestamps for createdAt and updatedAt
);

// Create and export the UserFriendAdd model
const UserFriendAdd = mongoose.model("UserFriendAdd", userFriendAddSchema);

module.exports = UserFriendAdd;
