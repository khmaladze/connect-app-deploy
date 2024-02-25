const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const Joi = require("joi");
const StoryView = require("../../../models/story/story-view");

// Validation schema
const storyViewSchema = Joi.object({
  story_id: Joi.string().required(),
});

// Route message
const routeMessage = {
  view_already_exists: "view already exists",
  story_view_success: "story view add success",
};

/**
 * Allow a user to view a specific story.
 */
exports.businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    // Validate request body
    const schemaValidation = await storyViewSchema.validateAsync(req.body);

    const { story_id } = req.body;

    const isViewAlreadyExists = await StoryView.exists({
      story_id: story_id,
      view_author_id: userProfileId,
    });

    if (isViewAlreadyExists) {
      return custom_server_response(res, 200, routeMessage.view_already_exists);
    }

    const newData = await StoryView.create({
      story_id: story_id,
      view_author_id: userProfileId,
    });

    return custom_server_response(
      res,
      200,
      routeMessage.story_view_success,
      newData
    );
  } catch (error) {
    return customServerError(res, error);
  }
};
