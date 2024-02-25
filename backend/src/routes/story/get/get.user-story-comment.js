// Import necessary modules and components
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const StoryCommentModel = require("../../../models/story/story-comment-model");
const { User } = require("../../../models/user/user-model");

// Messages for different scenarios
const routeMessage = {
  invalid_parameters: "Both story_id and user_id are required.",
  no_comments_found: "No comments found for the given user and story.",
  comments_retrieved_success: "Comments retrieved successfully.",
};

// Route to get comments for a user and story
const businessLogic = async (req, res) => {
  try {
    const user_id = req.user._id;
    // Destructure story_id and user_id from query parameters
    const { story_id } = req.query;

    // Validate the presence of both story_id and user_id
    if (!story_id || !user_id) {
      return custom_server_response(res, 400, routeMessage.invalid_parameters);
    }

    // Retrieve comments for the specified user and story
    const comments = await StoryCommentModel.find({
      author_id: user_id,
      story_id: story_id,
    });

    // Fetch additional information about the user who authored each comment
    const commentsWithUserInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findOne({ _id: comment.author_id });
        return {
          ...comment.toObject(),
          author_profileImage: user ? user.profileImage : "",
        };
      })
    );

    // Return success response with the retrieved comments
    return custom_server_response(
      res,
      200,
      routeMessage.comments_retrieved_success,
      commentsWithUserInfo
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
