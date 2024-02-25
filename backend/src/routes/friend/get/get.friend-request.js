const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { User } = require("../../../models/user/user-model");
const UserFriendAdd = require("../../../models/friend/friend-send-request");

const routeMessage = {
  get_friend_request_success: "get friend request success",
};

const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    const userFriendRequest = await UserFriendAdd.find({
      receiver: userProfileId,
      status: "pending",
    }).select("_id sender receiver");

    if (userFriendRequest.length < 1) {
      return custom_server_response(
        res,
        200,
        routeMessage.get_friend_request_success,
        userFriendRequest
      );
    }

    const friendRequestPromises = userFriendRequest.map(async (request) => {
      const userDetails = await User.findOne({
        _id: request.sender,
      }).select("_id username gender profileImage");

      return { user: userDetails, request };
    });

    const friendRequests = await Promise.all(friendRequestPromises);

    return custom_server_response(
      res,
      200,
      routeMessage.get_friend_request_success,
      friendRequests
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
