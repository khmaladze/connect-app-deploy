const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const { User } = require("../../../models/user/user-model");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const passwordUpdateSchema = Joi.object({
  password: Joi.string()
    .required()
    .min(10)
    .max(100)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%^&\\*])(?=.{10,})"
      )
    )
    .message(
      "must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 10 characters long"
    ),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")),
});

const routeMessage = {
  update_user_password_success: "update user password success",
};

const businessLogic = async (req, res) => {
  try {
    const schemaValidation = await passwordUpdateSchema.validateAsync(req.body);

    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      { new: true }
    );

    return custom_server_response(
      res,
      200,
      routeMessage.update_user_password_success
    );
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
