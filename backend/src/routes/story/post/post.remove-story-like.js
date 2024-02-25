const Joi = require("joi");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const StoryLike = require("../../../models/story/story-like-model");

// Validation schema using Joi
const storyLikeSchema = Joi.object({
  story_id: Joi.string().required(),
});

// Route message constants
const routeMessage = {
  like_not_exists: "like not exists",
  like_already_exists: "like already exists",
  story_like_remove_success: "story like remove success",
};

// Business logic for removing a story like
exports.businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    // Validate request body
    const schemaValidation = await storyLikeSchema.validateAsync(req.body);

    const { story_id } = req.body;

    const isLikeAlreadyExists = await StoryLike.exists({
      story_id: story_id,
      like_author_id: userProfileId,
    });

    if (!isLikeAlreadyExists) {
      return custom_server_response(res, 400, routeMessage.like_not_exists);
    }

    await StoryLike.deleteOne({
      story_id: story_id,
      like_author_id: userProfileId,
    });

    return custom_server_response(
      res,
      200,
      routeMessage.story_like_remove_success
    );
  } catch (error) {
    return customServerError(res, error);
  }
};
