const { Response } = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const Joi = require("joi");
const { PostLike } = require("../../../models/post/post-like-model");

// Validation schema
const postLikeSchema = Joi.object({
  post_id: Joi.string().required(),
});

// Route message constants
const routeMessage = {
  like_not_exists: "Like does not exist",
  post_like_remove_success: "Post like removed successfully",
};

const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    // Validate request body
    const schemaValidation = await postLikeSchema.validateAsync(req.body);

    const { post_id } = req.body;

    const isLikeAlreadyExists = await PostLike.exists({
      post_id: post_id,
      like_author_id: userProfileId,
    });

    if (!isLikeAlreadyExists) {
      return custom_server_response(res, 400, routeMessage.like_not_exists);
    }

    await PostLike.deleteOne({
      post_id: post_id,
      like_author_id: userProfileId,
    });

    return custom_server_response(
      res,
      200,
      routeMessage.post_like_remove_success
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
