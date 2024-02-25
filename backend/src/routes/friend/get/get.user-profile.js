const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { User } = require("../../../models/user/user-model");
const UserFriendAdd = require("../../../models/friend/friend-send-request");

const routeMessage = {
  username_required: "username required",
  user_not_found: "user not found",
  user_get_success: "user get success",
};

const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    // Get data from param
    const username = req.params.username;

    if (!username) {
      return custom_server_response(res, 400, routeMessage.username_required);
    }

    const getUserProfile = await User.findOne({
      username,
    }).select("_id username profileImage gender");

    if (!getUserProfile) {
      return custom_server_response(res, 400, routeMessage.user_not_found);
    }

    if (getUserProfile._id.toString() == userProfileId.toString()) {
      return custom_server_response(res, 400, routeMessage.user_not_found);
    }

    // Check if we already send request
    const sendRequestAlready = await UserFriendAdd.find({
      sender: userProfileId,
      receiver: getUserProfile._id.toString(),
    });

    if (sendRequestAlready.length > 0) {
      if (sendRequestAlready[0].status == "accepted") {
        return custom_server_response(res, 400, "user is already friend");
      }
      return custom_server_response(res, 400, "you already send");
    }

    // Check if user already send us friend request
    const userAlreadySendFriendRequest = await UserFriendAdd.find({
      receiver: userProfileId,
      sender: getUserProfile._id.toString(),
    });

    if (userAlreadySendFriendRequest.length > 0) {
      if (userAlreadySendFriendRequest[0].status == "accepted") {
        return custom_server_response(res, 400, "user is already friend");
      }
      if (userAlreadySendFriendRequest[0].status == "rejected") {
        return custom_server_response(
          res,
          200,
          routeMessage.user_get_success,
          getUserProfile
        );
      } else {
        return custom_server_response(res, 400, "user send you");
      }
    }

    return custom_server_response(
      res,
      200,
      routeMessage.user_get_success,
      getUserProfile
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
