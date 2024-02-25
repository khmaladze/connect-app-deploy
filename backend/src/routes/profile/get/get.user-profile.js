const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { UserProfile } = require("../../../models/user/user-profile-model");

const routeMessage = {
  add_min_one_fields: "add min one fields",
  userprofile_data_success: "userprofile data add success",
  user_image_update_failed: "user image update failed",
  user_profileImage_update_success: "user profileImage update success",
};

const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    const userData = await UserProfile.findOne({
      user_profile_id: userProfileId,
    });

    return custom_server_response(
      res,
      200,
      routeMessage.userprofile_data_success,
      userData
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
