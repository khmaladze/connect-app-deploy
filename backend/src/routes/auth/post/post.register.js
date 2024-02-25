const express = require("express");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { User } = require("../../../models/user/user-model");
const { UserFriend } = require("../../../models/friend/friend-model");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const {
  getZodiacSign,
  isValidDate,
} = require("../../../function/server-user-profile");
const { UserProfile } = require("../../../models/user/user-profile-model");

const registrationSchema = Joi.object({
  firstname: Joi.string().trim().lowercase().required().min(2).max(20),
  lastname: Joi.string().trim().lowercase().required().min(2).max(20),
  username: Joi.string().trim().lowercase().required().min(2).max(20),
  gender: Joi.string().valid("male", "female", "other").lowercase().required(),
  birthDay: Joi.number().required().min(1).max(31),
  birthMonth: Joi.number().required().min(1).max(12),
  birthYear: Joi.number().required().min(1900).max(new Date().getFullYear()),
  email: Joi.string()
    .email({
      tlds: { allow: ["com"] },
      minDomainSegments: 2,
    })
    .regex(/@(gmail|yahoo|outlook)\.com$/)
    .trim()
    .lowercase()
    .required(),
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
  user_email_exist: "Email already exists. Try another email.",
  user_username_exist: "Username already exists. Try another username.",
  user_not_valid_date: "Invalid date provided.",
  auth_user_register: "User registration success.",
};

const businessLogic = async (req, res) => {
  try {
    await registrationSchema.validateAsync(req.body);

    const {
      firstname,
      lastname,
      username,
      email,
      gender,
      birthDay,
      birthMonth,
      birthYear,
      password,
    } = req.body;

    const emailExists = await User.exists({ email });
    if (emailExists) {
      return custom_server_response(res, 400, routeMessage.user_email_exist);
    }

    const usernameExists = await User.exists({ username });
    if (usernameExists) {
      return custom_server_response(res, 400, routeMessage.user_username_exist);
    }

    if (!isValidDate(birthYear, birthMonth, birthDay)) {
      return custom_server_response(res, 400, routeMessage.user_not_valid_date);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      username,
      gender,
      birthDay,
      birthMonth,
      birthYear,
      email,
      password: hashedPassword,
    });

    await UserProfile.create({
      user_profile_id: user._id,
      zodiac: getZodiacSign(Number(birthMonth), Number(birthDay)).toLowerCase(),
    });

    await UserFriend.create({ user_profile_id: user._id });

    return custom_server_response(res, 200, routeMessage.auth_user_register);
  } catch (error) {
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
