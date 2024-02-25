const { Response } = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const StoryLike = require("../../../models/story/story-like-model");

// route message
const routeMessage = {
  like_already_exists: "like already exists",
  like_dont_exists: "like don't exists",
};

exports.businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;
    const storyId = req.params.storyId;

    const isLikeExists = await StoryLike.exists({
      story_id: storyId,
      like_author_id: userProfileId,
    });

    const count = await StoryLike.countDocuments({ story_id: storyId });

    if (isLikeExists) {
      return custom_server_response(
        res,
        200,
        routeMessage.like_already_exists,
        { liked: true, count: count }
      );
    }

    return custom_server_response(res, 200, routeMessage.like_dont_exists, {
      liked: false,
      count: count,
    });
  } catch (error) {
    return customServerError(res, error);
  }
};
