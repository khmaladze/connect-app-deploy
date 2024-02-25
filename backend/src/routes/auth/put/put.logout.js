const express = require("express");
const userActiveModel = require("../../../models/user/user-active-model");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");

const routeMessage = {
  user_log_out_success: "User log out success.",
};

const businessLogic = async (req, res) => {
  try {
    let token = "";

    // Get token from header
    token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    // Update user's token status to "LogOut"
    await userActiveModel.findOneAndUpdate(
      {
        jwt: token,
        user_id: req.user._id,
      },
      { status: "LogOut" },
      { new: true }
    );

    return custom_server_response(res, 200, routeMessage.user_log_out_success);
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
