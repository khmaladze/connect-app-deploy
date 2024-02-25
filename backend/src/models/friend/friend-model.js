const mongoose = require("mongoose");

// Enum representing different friend list types
const FriendListType = {
  Friend: "Friend",
  CloseFriend: "CloseFriend",
  Favorite: "Favorite",
};

// Define the structure of a friend entry in the user's friend list
const FriendEntrySchema = new mongoose.Schema({
  friends_from: { type: Date, default: Date.now },
  friend_list: {
    type: String,
    enum: Object.values(FriendListType),
    default: FriendListType.Friend,
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Define the structure of the UserFriend document
const UserFriendSchema = new mongoose.Schema(
  {
    user_profile_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    friends: [FriendEntrySchema],
  },
  { timestamps: true }
);

// Create the UserFriend model from the schema
const UserFriend = mongoose.model("UserFriend", UserFriendSchema);

module.exports = { UserFriend };
