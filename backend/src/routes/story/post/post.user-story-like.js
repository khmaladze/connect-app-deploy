const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const Joi = require("joi");
const StoryLike = require("../../../models/story/story-like-model");

// Validation schema
const storyLikeSchema = Joi.object({
  story_id: Joi.string().required(),
});

// Route message
const routeMessage = {
  like_already_exists: "like already exists",
  story_like_success: "story like success",
};

/**
 * Allow a user to like a specific story.
 */
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

    if (isLikeAlreadyExists) {
      return custom_server_response(res, 400, routeMessage.like_already_exists);
    }

    const newData = await StoryLike.create({
      story_id: story_id,
      like_author_id: userProfileId,
    });

    return custom_server_response(
      res,
      200,
      routeMessage.story_like_success,
      newData
    );
  } catch (error) {
    return customServerError(res, error);
  }
};
