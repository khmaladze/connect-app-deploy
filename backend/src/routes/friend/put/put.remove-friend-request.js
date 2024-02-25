const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const Joi = require("joi");
const UserFriendAdd = require("../../../models/friend/friend-send-request");

const responseFriendRequestSchema = Joi.object({
  id: Joi.string(),
});

const routeMessage = {
  user_already_respond: "user already respond",
  request_remove_success: "friend request remove success",
};

const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    const { id } = req.body;

    // Validate request body
    const schemaValidation = await responseFriendRequestSchema.validateAsync(
      req.body
    );

    const userFriendRequest = await UserFriendAdd.find({
      _id: id,
      sender: userProfileId,
    });

    if (userFriendRequest.length > 0) {
      if (
        userFriendRequest[0].status === "accepted" ||
        userFriendRequest[0].status === "rejected"
      ) {
        return custom_server_response(
          res,
          200,
          routeMessage.user_already_respond
        );
      }
    } else {
      return custom_server_response(res, 404, "Friend request not found");
    }

    if (userFriendRequest[0].status === "pending") {
      await UserFriendAdd.findByIdAndDelete(id);
    }

    return custom_server_response(
      res,
      200,
      routeMessage.request_remove_success
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
