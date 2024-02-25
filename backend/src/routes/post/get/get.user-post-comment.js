// Import necessary modules and components
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { CustomRequest } = require("../../../middleware/user-authorization");
const { User } = require("../../../models/user/user-model");
const CommentModel = require("../../../models/post/post-comment-model");

// Messages for different scenarios
const routeMessage = {
  invalid_parameters: "Both post_id and user_id are required.",
  no_comments_found: "No comments found for the given user and post.",
  comments_retrieved_success: "Comments retrieved successfully.",
};

// Route to get comments for a user and post
const businessLogic = async (req, res) => {
  try {
    // Destructure post_id and user_id from query parameters
    const { post_id } = req.query;

    // Validate the presence of both post_id and user_id
    if (!post_id) {
      return custom_server_response(res, 400, routeMessage.invalid_parameters);
    }

    // Retrieve comments for the specified user and post
    const comments = await CommentModel.find({
      author_id: req.user._id,
      post_id: post_id,
    });

    // Fetch additional information about the user who posted each comment
    const commentsWithUserInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findOne({ _id: comment.author_id });
        return {
          ...comment.toObject(),
          author_profileImage: user ? user.profileImage : "",
          gender: user ? user.gender : "",
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
