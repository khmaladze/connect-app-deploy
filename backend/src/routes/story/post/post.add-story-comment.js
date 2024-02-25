const Joi = require("joi");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const StoryCommentModel = require("../../../models/story/story-comment-model");

// Validation schema using Joi
const commentSchema = Joi.object({
  story_id: Joi.string().required(),
  comment: Joi.string().required().max(70), // Limit comment length to a maximum of 70 characters
});

// Messages for different scenarios
const routeMessage = {
  user_can_only_comment_once_on_a_story:
    "User can only comment once on a story.",
  add_comment_success: "Add comment success.",
};

// Business logic for creating a new comment
exports.businessLogic = async (req, res) => {
  try {
    // Destructure validated data for easier access
    const { story_id, comment } = req.body;

    // Validate request body using Joi schema
    const validatedData = await commentSchema.validateAsync(req.body);

    // Check if the user has already commented on the story
    const existingComment = await StoryCommentModel.findOne({
      author_id: req.user._id,
      story_id: story_id,
    });

    if (existingComment) {
      // If the user has already commented, return an error response
      return custom_server_response(
        res,
        400,
        routeMessage.user_can_only_comment_once_on_a_story
      );
    }

    // Create a new comment
    const newComment = await StoryCommentModel.create({
      author_id: req.user._id,
      story_id: story_id,
      comment: comment,
    });

    // Return a success response with the newly created comment
    return custom_server_response(
      res,
      200,
      routeMessage.add_comment_success,
      newComment
    );
  } catch (error) {
    return customServerError(res, error);
  }
};
