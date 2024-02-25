const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { User } = require("../../../models/user/user-model");

const routeMessage = {
  get_friend_chat_success: "get friend chat success",
};

const businessLogic = async (req, res) => {
  try {
    const userDetail = await User.findOne({
      _id: req.params.friendId,
    }).select("_id username gender profileImage");

    return custom_server_response(
      res,
      200,
      routeMessage.get_friend_chat_success,
      userDetail
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
