const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const Message = require("../../../models/messages/message-model");

const businessLogic = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.friendId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    return custom_server_response(
      res,
      200,
      "User messages fetched successfully",
      messages
    );
  } catch (error) {
    return customServerError(res, error, req);
  }
};

module.exports = { businessLogic };
