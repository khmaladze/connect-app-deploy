const express = require("express");
const Joi = require("joi");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { userProfileData } = require("../../../data/user-profile");
const { UserProfile } = require("../../../models/user/user-profile-model");

const userProfileSchema = Joi.object({
  languages: Joi.array().items(
    Joi.string().valid(...userProfileData.languages)
  ),
  education: Joi.string().valid(...userProfileData.education),
  passions: Joi.array().items(Joi.string().valid(...userProfileData.passions)),
});

const routeMessage = {
  add_min_one_fields: "add min one fields",
  userprofile_data_success: "userprofile data add success",
  user_image_update_failed: "user image update failed",
  user_profileImage_update_success: "user profileImage update success",
};

const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    // Validate request body
    const schemaValidation = await userProfileSchema.validateAsync(req.body);

    // Get data from request body
    const { languages, education, passions } = req.body;

    if (!languages && !education && !passions) {
      return custom_server_response(res, 400, routeMessage.add_min_one_fields);
    }

    let userProfileData = {
      languages: [],
      education: "",
      passions: [],
    };

    if (languages) {
      userProfileData.languages = languages;
    }

    if (education) {
      userProfileData.education = education;
    }

    if (passions) {
      userProfileData.passions = passions;
    }

    await UserProfile.findOneAndUpdate(
      { user_profile_id: userProfileId },
      userProfileData,
      {
        new: true,
      }
    );

    return custom_server_response(
      res,
      200,
      routeMessage.userprofile_data_success
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
