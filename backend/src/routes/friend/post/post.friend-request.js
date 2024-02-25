const express = require("express");
const Joi = require("joi");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { User } = require("../../../models/user/user-model");
const UserFriendAdd = require("../../../models/friend/friend-send-request");

const sendFriendRequestSchema = Joi.object({
  receiver: Joi.string().trim().lowercase().required().min(2).max(200),
  friend_list: Joi.string()
    .valid("Friend", "CloseFriend", "Favorite")
    .required(),
});

const routeMessage = {
  receiver_not_exists: "receiver not exists",
  friend_request_already_exists: "friend request already exists",
  person_already_send_you_request: "person already send you request",
  send_friend_request_success: "send friend request success",
};

const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    // Validate request body
    const schemaValidation = await sendFriendRequestSchema.validateAsync(
      req.body
    );

    // Get data from request body
    const { receiver, friend_list } = req.body;

    // Check that receiver and userProfileId are different
    if (receiver === userProfileId.toString()) {
      return custom_server_response(res, 400, routeMessage.receiver_not_exists);
    }

    // Check if receiver exists
    const isValidreceiver = await User.findOne({
      _id: receiver,
    });
    if (!isValidreceiver) {
      return custom_server_response(res, 400, routeMessage.receiver_not_exists);
    }

    // Check if the friend request already sent
    const friendRequestAlreadyExists = await UserFriendAdd.exists({
      receiver: receiver,
      sender: userProfileId.toString(),
    });
    if (friendRequestAlreadyExists) {
      return custom_server_response(
        res,
        400,
        routeMessage.friend_request_already_exists
      );
    }

    // Check if the person already sent us a friend request
    const receiverFriendRequestAlreadyExists = await UserFriendAdd.exists({
      receiver: userProfileId.toString(),
      sender: receiver,
    });

    if (receiverFriendRequestAlreadyExists) {
      const requestStatus = await UserFriendAdd.find({
        receiver: userProfileId.toString(),
        sender: receiver,
      });

      if (requestStatus[0].status == "rejected") {
        const sendFriendRequest = await UserFriendAdd.create({
          sender: userProfileId.toString(),
          receiver: receiver,
          friend_list: friend_list,
        });

        return custom_server_response(
          res,
          200,
          routeMessage.send_friend_request_success,
          sendFriendRequest
        );
      }

      return custom_server_response(
        res,
        400,
        routeMessage.person_already_send_you_request
      );
    }

    const sendFriendRequest = await UserFriendAdd.create({
      sender: userProfileId.toString(),
      receiver: receiver,
      friend_list: friend_list,
    });

    return custom_server_response(
      res,
      200,
      routeMessage.send_friend_request_success,
      sendFriendRequest
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
