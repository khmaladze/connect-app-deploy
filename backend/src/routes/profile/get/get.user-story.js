const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const Story = require("../../../models/story/story-model");

const routeMessage = {
  get_user_story: "get user story",
};

const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    const userstorys = await Story.find({
      author: userProfileId,
      expiryDate: { $gt: Date.now() },
    }).sort("-createdAt");

    return custom_server_response(
      res,
      200,
      routeMessage.get_user_story,
      userstorys
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
