// Import necessary modules and models
const express = require("express");
const { UserFriend } = require("../../../models/friend/friend-model");
const { Post } = require("../../../models/post/post-model");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { User } = require("../../../models/user/user-model");
const { PostLike } = require("../../../models/post/post-like-model");

// Route message constants
const routeMessage = {
  success: "User friends posts fetched successfully",
  noPostsFound: "No posts found for user friends",
  error: "Error fetching user friends posts",
};

// Define friend list types
const friendListTypes = {
  Friend: ["Friend"],
  CloseFriend: ["Friend", "CloseFriend"],
  Favorite: ["Friend", "CloseFriend", "Favorite"],
};

/**
 * Sorts posts based on the order of the 'list' property.
 * @param posts - Array of post objects.
 * @returns Sorted array of post objects.
 */
function sortPostsByList(posts) {
  const order = ["Favorite", "CloseFriend", "Friend"];

  return posts.sort((a, b) => {
    const indexA = order.indexOf(a.list);
    const indexB = order.indexOf(b.list);

    if (indexA !== indexB) {
      return indexA - indexB;
    }

    return b.createdAt - a.createdAt;
  });
}

// Business logic for getting user's friends' posts
const businessLogic = async (req, res) => {
  try {
    // Extract user ID from request
    const userId = req.user._id;

    // Extract pagination parameters
    const page = parseInt(req.query.page || "1");
    const pageSize = parseInt(req.query.pageSize || "5");

    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;

    // Get user's friend list
    const userFriend = await UserFriend.findOne({
      user_profile_id: userId,
    });

    // Check if friend list exists
    if (!userFriend) {
      return custom_server_response(res, 404, routeMessage.noPostsFound);
    }

    // Initialize an empty array to store friend IDs with posts
    let friendIdsWithPosts = [];

    // Iterate through friend lists and add corresponding friend IDs
    for (const [listType, allowedLists] of Object.entries(friendListTypes)) {
      if (
        userFriend.friends.some((friend) =>
          allowedLists.includes(friend.friend_list)
        )
      ) {
        friendIdsWithPosts = [
          ...friendIdsWithPosts,
          ...userFriend.friends
            .filter(
              (friend) =>
                allowedLists.includes(friend.friend_list) &&
                friend.user_id !== userId &&
                friend.user_id !== null
            )
            .map((friend) => friend.user_id),
        ];
      }
    }

    // Get posts of user's friends with author information
    const posts = await Post.find({
      author: { $in: friendIdsWithPosts },
      expiryDate: { $gt: Date.now() },
    })
      .sort({ createdAt: -1 }) // Sort posts by createdAt in descending order
      .limit(pageSize) // Limit the number of posts per page
      .skip(skip); // Skip posts based on pagination

    // Check if there are more posts
    const hasMore = posts.length === pageSize;

    // Extract user IDs from post authors
    const authorIds = posts.map((post) => post.author);

    // Find users by _id
    const users = await User.find({ _id: { $in: authorIds } });

    // Add user information to each post object
    const postsWithUserInfo = await Promise.all(
      posts.map(async (post) => {
        // Find user corresponding to the post author
        const user = users.find((u) => u._id.equals(post.author));

        // Check if the like exists for the specified post and user
        const isLikeExists = await PostLike.exists({
          post_id: post._id,
          like_author_id: req.user._id,
        }).catch((error) => {
          console.error("Error checking like for post:", error);
          return false; // Set like existence to false in case of error
        });

        return {
          ...post.toObject(), // Convert Mongoose document to plain JavaScript object
          liked: isLikeExists ? true : false,
          user: {
            profileImage: user.profileImage,
            firstname: user.firstname,
            lastname: user.lastname,
            gender: user.gender,
          },
        };
      })
    );

    const sorted = sortPostsByList(postsWithUserInfo);

    return custom_server_response(res, 200, routeMessage.success, sorted);
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
