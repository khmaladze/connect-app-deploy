const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { CustomRequest } = require("../../../middleware/user-authorization");
const { UserFriend } = require("../../../models/friend/friend-model");

const routeMessages = {
  error_cannot_update_friend_list: "Error, can't update friend list",
  friend_list_update_success: "Friend list updated successfully",
  friend_not_found: "Friend not found",
};

/**
 * Handles the business logic for updating the friend list in the user's friend list.
 */
const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;
    const { friendId, newFriendListType } = req.body;

    // Find the user's friend list
    const userFriend = await UserFriend.findOne({
      user_profile_id: userProfileId,
    });

    if (!userFriend) {
      return custom_server_response(res, 404, routeMessages.friend_not_found);
    }

    // Check if the friend is in the user's friend list
    const existingFriendIndex = userFriend.friends.findIndex(
      (friend) => friend.user_id.toString() === friendId
    );

    if (existingFriendIndex !== -1) {
      // If the friend exists, update the friend_list type
      userFriend.friends[existingFriendIndex].friend_list = newFriendListType;

      // Save the updated user friend document
      await userFriend.save();

      return custom_server_response(
        res,
        200,
        routeMessages.friend_list_update_success
      );
    } else {
      return custom_server_response(res, 404, routeMessages.friend_not_found);
    }
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
