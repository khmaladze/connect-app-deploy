const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const Message = require("../../../models/messages/message-model");

const businessLogic = async (req, res) => {
  try {
    const { receiver, message } = req.body;
    const sender = req.user._id;

    const newMessage = await Message.create({ sender, receiver, message });

    return custom_server_response(
      res,
      200,
      "Message sent successfully",
      newMessage
    );
  } catch (error) {
    return customServerError(res, error, req);
  }
};

module.exports = { businessLogic };
