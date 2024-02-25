const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");

const { Post } = require("../../../models/post/post-model");

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

    return custom_server_response(
      res,
      200,
      routeMessage.get_user_post,
      userPosts
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
