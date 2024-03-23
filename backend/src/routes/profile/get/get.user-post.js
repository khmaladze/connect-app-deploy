const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { Post } = require("../../../models/post/post-model");
const { User } = require("../../../models/user/user-model");
const CommentModel = require("../../../models/post/post-comment-model");
const { PostLike } = require("../../../models/post/post-like-model");

const routeMessage = {
  get_user_post: "get user post",
};

const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;

    const pageSize = 5;
    const postsToSkip = (page - 1) * pageSize;

    const userPosts = await Post.find({ author: userProfileId })
      .sort("-createdAt")
      .skip(postsToSkip)
      .limit(pageSize);

    // Add user information to each post object
    const postsWithUserInfo = await Promise.all(
      userPosts.map(async (post) => {
        // Find user corresponding to the post author
        const user = await User.findOne({ _id: userProfileId });

        // Check if the like exists for the specified post and user
        const isLikeExists = await PostLike.exists({
          post_id: post._id,
          like_author_id: userProfileId,
        }).catch((error) => {
          console.error("Error checking like for post:", error);
          return false; // Set like existence to false in case of error
        });

        // Fetch comments for the post
        const comments = await CommentModel.find({
          post_id: post._id,
          author_id: userProfileId,
        });

        // Fetch additional information about the users who posted each comment
        const commentsWithUserInfo = await Promise.all(
          comments.map(async (comment) => {
            const commenter = await User.findOne({ _id: userProfileId });
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

    return custom_server_response(
      res,
      200,
      routeMessage.get_user_post,
      postsWithUserInfo
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
