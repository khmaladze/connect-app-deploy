const { Response } = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { UserFriend } = require("../../../models/friend/friend-model");
const { User } = require("../../../models/user/user-model");

const routeMessage = {
  get_friend_list_success: "get friend list success",
};

const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    const userFriend = await UserFriend.find({
      user_profile_id: userProfileId,
    }).select("friends");

    const friendPromises = userFriend[0].friends.map(async (request) => {
      const userDetails = await User.findOne({
        _id: request.user_id,
      }).select("_id username gender profileImage");

      return { user: userDetails, request };
    });

    const friendList = await Promise.all(friendPromises);

    return custom_server_response(
      res,
      200,
      routeMessage.get_friend_list_success,
      friendList
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
