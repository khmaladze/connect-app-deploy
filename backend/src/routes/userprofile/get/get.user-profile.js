const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { UserFriend } = require("../../../models/friend/friend-model");
const { User } = require("../../../models/user/user-model");
const { Post } = require("../../../models/post/post-model");
const { UserProfile } = require("../../../models/user/user-profile-model");
const Story = require("../../../models/story/story-model");

const routeMessage = {
  success: "User profile and posts fetched successfully",
  notInFriendList: "User is not in your friend list",
  error: "Error fetching user profile and posts",
};

exports.businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;
    const { profileId } = req.params;

    // Check if the target user is in the friend list
    const isFriend = await UserFriend.exists({
      user_profile_id: userProfileId,
      friends: { $elemMatch: { user_id: profileId } },
    });

    if (!isFriend) {
      return custom_server_response(res, 404, routeMessage.notInFriendList);
    }

    // Fetch user profile data
    const userBasicProfileData = await User.findOne({
      _id: profileId,
    }).select("_id firstname lastname username gender profileImage");

    const userProfileData = await UserProfile.findOne({
      user_profile_id: profileId,
    });

    // Fetch user's posts
    const userPosts = await Post.find({
      author: profileId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(20);

    // Fetch user's stories
    const userStories = await Story.find({
      author: profileId,
      expiryDate: { $gt: Date.now() },
    }).sort({
      createdAt: -1,
    });

    return custom_server_response(res, 200, routeMessage.success, {
      user: userBasicProfileData,
      userProfile: userProfileData,
      posts: userPosts,
      stories: userStories,
    });
  } catch (error) {
    return customServerError(res, error);
  }
};
