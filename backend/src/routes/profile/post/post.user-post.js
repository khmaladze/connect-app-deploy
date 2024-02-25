const express = require("express");
const Joi = require("joi");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { Post } = require("../../../models/post/post-model");
const {
  uploadToCloudinary,
} = require("../../../function/server-upload-image-video");

const postSchema = Joi.object({
  text: Joi.string().max(500),
  friendList: Joi.string().valid("Friend", "CloseFriend", "Favorite"),
});

const routeMessage = {
  add_text_or_image: "please add text or image",
  post_created_success: "post created success",
};

const validFileTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/mpeg",
];

const businessLogic = async (req, res) => {
  try {
    const userProfileId = req.user._id;

    // Validate request body
    const schemaValidation = await postSchema.validateAsync(req.body);

    const file = req.file;
    const text = req.body.text;
    const friendList = req.body.friendList;

    if (!text && !file) {
      return custom_server_response(res, 400, routeMessage.add_text_or_image);
    }

    let createData = { author: req.user };

    if (text) {
      createData.text = text;
    }

    if (friendList) {
      createData.list = friendList;
    }

    const fiveDay = 1000 * 60 * 60 * 24 * 5;
    createData.expiryDate = Date.now() + fiveDay;

    if (file) {
      // Check if the file type is valid (image or video)
      if (!validFileTypes.includes(file.mimetype)) {
        return custom_server_response(res, 400, "Invalid file type");
      }

      // Upload the file to Cloudinary in the specified folder
      const file_url = await uploadToCloudinary(String(userProfileId), file);
      createData.media = {
        url: file_url.secure_url,
        public_id: file_url.public_id,
      };
    }

    const newData = await Post.create(createData);

    return custom_server_response(
      res,
      200,
      routeMessage.post_created_success,
      newData
    );
  } catch (error) {
    return customServerError(res, error, req);
  }
};

module.exports = { businessLogic };
