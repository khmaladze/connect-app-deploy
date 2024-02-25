const { Post } = require("../../../models/post/post-model");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const CommentModel = require("../../../models/post/post-comment-model");

// Messages for different scenarios
const routeMessages = {
  post_not_found_or_unauthorized:
    "Post not found or user not authorized to delete.",
  delete_success: "Post associated comment deleted successfully.",
  internal_server_error: "Internal Server Error.",
};

const businessLogic = async (req, res) => {
  try {
    const postId = req.params.postId;
    const authorId = req.user._id; // Assuming you have the user information in the request

    // Find and delete the post
    const deletedPost = await Post.findOne({
      _id: postId,
    });

    if (!deletedPost) {
      return custom_server_response(
        res,
        404,
        routeMessages.post_not_found_or_unauthorized
      );
    }

    // Find and delete the associated comments
    await CommentModel.findOneAndDelete({
      post_id: postId,
      author_id: authorId,
    });

    return custom_server_response(res, 200, routeMessages.delete_success);
  } catch (error) {
    console.error(error);
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
