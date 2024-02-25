const express = require("express");
const { PostLike } = require("../../../models/post/post-like-model");
const { User } = require("../../../models/user/user-model");
const CommentModel = require("../../../models/post/post-comment-model");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { Post } = require("../../../models/post/post-model");

const routeMessages = {
  get_post_likes_and_comment_success: "get post likes and comment success",
  not_auth_user: "You are not authorized to view likes for this post",
  post_not_found: "Post not found",
};

const businessLogic = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return custom_server_response(res, 404, routeMessages.post_not_found);
    }

    if (req.user._id.toString() !== post.author.toString()) {
      return custom_server_response(res, 400, routeMessages.not_auth_user);
    }

    const likes = await PostLike.find({ post_id: postId });

    const likesWithUserInfo = await Promise.all(
      likes.map(async (like) => {
        const user = await User.findById(like.like_author_id).select(
          "username profileImage gender"
        );
        return {
          user_id: user?._id,
          username: user?.username,
          gender: user?.gender,
          profileImage: user?.profileImage,
          createdAt: like.createdAt,
          updatedAt: like.updatedAt,
        };
      })
    );

    const comments = await CommentModel.find({ post_id: postId });

    const commentsWithUserInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findById(comment.author_id).select(
          "username profileImage gender"
        );
        return {
          user_id: user?._id,
          username: user?.username,
          profileImage: user?.profileImage,
          gender: user?.gender,
          comment_text: comment.comment,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        };
      })
    );

    const likesAndCommentsData = {
      likes: {
        count: likesWithUserInfo.length,
        data: likesWithUserInfo,
      },
      comments: {
        count: commentsWithUserInfo.length,
        data: commentsWithUserInfo,
      },
    };

    return custom_server_response(
      res,
      200,
      routeMessages.get_post_likes_and_comment_success,
      likesAndCommentsData
    );
  } catch (error) {
    console.error("Error retrieving likes and comments:", error);
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
