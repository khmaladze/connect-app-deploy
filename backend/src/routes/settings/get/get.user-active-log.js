const express = require("express");
const userActiveModel = require("../../../models/user/user-active-model");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");

const routeMessage = {
  get_user_log_success: "get user active log success",
};

const businessLogic = async (req, res) => {
  try {
    const userActiveData = await userActiveModel
      .find({ user_id: req.user._id })
      .sort("-createdAt")
      .select("-jwt");

    return custom_server_response(
      res,
      200,
      routeMessage.get_user_log_success,
      userActiveData
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
