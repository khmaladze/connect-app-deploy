const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const Story = require("../../../models/story/story-model");
const StoryCommentModel = require("../../../models/story/story-comment-model");

// Messages for different scenarios
const routeMessages = {
  story_not_found_or_unauthorized:
    "story not found or user not authorized to delete.",
  delete_success: "story associated comment deleted successfully.",
  internal_server_error: "Internal Server Error.",
};

/**
 * Delete a story and its associated comments.
 */
exports.businessLogic = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const authorId = req.user._id; // Assuming you have the user information in the request

    // Find and delete the story
    const deletedstory = await Story.findOne({
      _id: storyId,
    });

    if (!deletedstory) {
      return custom_server_response(
        res,
        404,
        routeMessages.story_not_found_or_unauthorized
      );
    }

    // Find and delete the associated comments
    await StoryCommentModel.findOneAndDelete({
      story_id: storyId,
      author_id: authorId,
    });

    return custom_server_response(res, 200, routeMessages.delete_success);
  } catch (error) {
    console.error(error);
    return customServerError(res, error);
  }
};
