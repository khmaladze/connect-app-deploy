// Import necessary modules and components
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { CustomRequest } = require("../../../middleware/user-authorization");
const { PostLike } = require("../../../models/post/post-like-model");

// Route message
const routeMessage = {
  like_already_exists: "like already exists",
  like_dont_exists: "like don't exists",
};

// Business logic to check if the authenticated user has liked a specific post
const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;
    const postId = req.params.postId;

    // Check if the like exists for the specified post and user
    const isLikeExists = await PostLike.exists({
      post_id: postId,
      like_author_id: userProfileId,
    });

    // Count the total number of likes for the post
    const count = await PostLike.countDocuments({ post_id: postId });

    if (isLikeExists) {
      // Return response if like already exists
      return custom_server_response(
        res,
        200,
        routeMessage.like_already_exists,
        { liked: true, count: count }
      );
    }

    // Return response if like doesn't exist
    return custom_server_response(res, 200, routeMessage.like_dont_exists, {
      liked: false,
      count: count,
    });
  } catch (error) {
    // Handle any unexpected errors
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
