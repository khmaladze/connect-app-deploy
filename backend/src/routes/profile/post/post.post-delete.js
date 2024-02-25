const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { Post } = require("../../../models/post/post-model");
const CommentModel = require("../../../models/post/post-comment-model");
const { PostLike } = require("../../../models/post/post-like-model");
const {
  deleteFileFromCloudinary,
} = require("../../../function/server-file-delete");

const routeMessages = {
  post_not_found_or_unauthorized:
    "Post not found or user not authorized to delete.",
  post_deleted_successfully: "Post deleted successfully.",
  internal_server_error: "Internal Server Error.",
};

const businessLogic = async (req, res) => {
  try {
    const postId = req.params.postId;
    const authorId = req.user._id;

    const deletedPostFile = await Post.findOneAndDelete({
      _id: postId,
      author: authorId,
    }).select("media");

    if (!deletedPostFile) {
      return custom_server_response(
        res,
        404,
        routeMessages.post_not_found_or_unauthorized
      );
    }

    if (deletedPostFile.media.length > 0) {
      const mediaType =
        deletedPostFile.media[0].url.slice(-3) === "mp4" ? "video" : "image";
      await deleteFileFromCloudinary(
        deletedPostFile.media[0].public_id,
        mediaType
      );
    }

    await PostLike.deleteMany({ post_id: postId });
    await CommentModel.deleteMany({ post_id: postId });

    return custom_server_response(
      res,
      200,
      routeMessages.post_deleted_successfully
    );
  } catch (error) {
    console.error(error);
    return customServerError(res, routeMessages.internal_server_error);
  }
};

module.exports = { businessLogic };
