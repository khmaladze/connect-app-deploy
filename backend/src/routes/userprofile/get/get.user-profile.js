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
const { PostLike } = require("../../../models/post/post-like-model");
const CommentModel = require("../../../models/post/post-comment-model");

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

    // Add user information to each post object and fetch comments for each post
    const postsWithUserInfo = await Promise.all(
      userPosts.map(async (post) => {
        // Find user corresponding to the post author
        const user = await User.findOne({ _id: post.author });

        // Check if the like exists for the specified post and user
        const isLikeExists = await PostLike.exists({
          post_id: post._id,
          like_author_id: req.user._id,
        }).catch((error) => {
          console.error("Error checking like for post:", error);
          return false; // Set like existence to false in case of error
        });

        // Fetch comments for the post
        const comments = await CommentModel.find({
          post_id: post._id,
        });

        // Fetch additional information about the users who posted each comment
        const commentsWithUserInfo = await Promise.all(
          comments.map(async (comment) => {
            const commenter = await User.findOne({ _id: comment.author_id });
            return {
              ...comment.toObject(),
              commenter_profileImage: commenter ? commenter.profileImage : "",
              commenter_gender: commenter ? commenter.gender : "",
            };
          })
        );

        return {
          ...post.toObject(), // Convert Mongoose document to plain JavaScript object
          liked: isLikeExists ? true : false,
          user: {
            profileImage: user.profileImage,
            firstname: user.firstname,
            lastname: user.lastname,
            gender: user.gender,
          },
          comments: commentsWithUserInfo, // Include comments in the post object
        };
      })
    );

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
      posts: postsWithUserInfo,
      stories: userStories,
    });
  } catch (error) {
    return customServerError(res, error);
  }
};
