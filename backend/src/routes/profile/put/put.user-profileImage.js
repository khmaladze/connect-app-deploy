const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { User } = require("../../../models/user/user-model");
const {
  uploadImageToCloudinary,
} = require("../../../function/server-upload-image");
const {
  deleteFileFromCloudinary,
} = require("../../../function/server-file-delete");

const routeMessage = {
  add_min_one_fields: "add min one fields",
  userprofile_data_success: "userprofile data add success",
  user_image_update_failed: "user image update failed",
  user_profileImage_update_success: "user profileImage update success",
};

const multerImageMessage = {
  image_required: "image required",
};

const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    const file = req.file; // Assuming the file is sent as 'image' field in the form data

    if (!file) {
      return custom_server_response(
        res,
        400,
        multerImageMessage.image_required
      );
    }

    // Upload the image to Cloudinary in the specified folder
    const imageUrl = await uploadImageToCloudinary(String(userProfileId), file);

    const deleteOldImageUrl = await User.findOne({ _id: userProfileId }).select(
      "_id profileImagePublicId"
    );

    if (deleteOldImageUrl) {
      const deleted = await deleteFileFromCloudinary(
        String(deleteOldImageUrl?.profileImagePublicId),
        "image"
      );
      if (!deleted) {
        return custom_server_response(
          res,
          400,
          routeMessage.user_image_update_failed
        );
      }
    }

    const newData = await User.findOneAndUpdate(
      { _id: userProfileId },
      {
        profileImage: imageUrl.secure_url,
        profileImagePublicId: imageUrl.public_id,
      },
      { new: true }
    ).select("_id profileImage");

    return custom_server_response(
      res,
      200,
      routeMessage.user_profileImage_update_success,
      newData
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
