const express = require("express");
const { UserFriend } = require("../../../models/friend/friend-model");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { User } = require("../../../models/user/user-model");
const Story = require("../../../models/story/story-model");

// Route message constants
const routeMessage = {
  success: "User friends storys fetched successfully",
  nostorysFound: "No storys found for user friends",
  error: "Error fetching user friends storys",
};

function sortstorysByList(storys) {
  const order = ["Favorite", "CloseFriend", "Friend"];

  return storys.sort((a, b) => {
    const indexA = order.indexOf(a.list);
    const indexB = order.indexOf(b.list);

    if (indexA !== indexB) {
      return indexA - indexB;
    }

    return b.createdAt - a.createdAt;
  });
}

// Business logic for getting user's friends' storys
exports.businessLogic = async (req, res) => {
  try {
    // Extract user ID from request
    const userId = req.user._id;

    // Get user's friend list
    const userFriend = await UserFriend.findOne({
      user_profile_id: userId,
    });

    // Check if friend list exists
    if (!userFriend) {
      return custom_server_response(res, 404, routeMessage.nostorysFound);
    }

    // Extract friend IDs with storys
    const friendIdsWithstorys = userFriend.friends
      .filter((friend) => friend.user_id !== userId && friend.user_id !== null)
      .map((friend) => friend.user_id);

    // Get storys of user's friends with author information
    const storys = await Story.find({
      author: { $in: friendIdsWithstorys },
      expiryDate: { $gt: Date.now() },
    }).sort({ createdAt: -1 }); // Sort storys by createdAt in descending order

    // Extract user IDs from story authors
    const authorIds = storys.map((story) => story.author);

    // Find users by _id
    const users = await User.find({ _id: { $in: authorIds } });

    // Add user information to each story object
    const storysWithUserInfo = storys.map((story) => {
      const user = users.find((u) => u._id.equals(story.author));
      return {
        ...story.toObject(), // Convert Mongoose document to plain JavaScript object
        user: {
          profileImage: user.profileImage,
          firstname: user.firstname,
          lastname: user.lastname,
          gender: user.gender,
        },
      };
    });

    const sorted = sortstorysByList(storysWithUserInfo);

    return custom_server_response(res, 200, routeMessage.success, sorted);
  } catch (error) {
    return customServerError(res, error);
  }
};
