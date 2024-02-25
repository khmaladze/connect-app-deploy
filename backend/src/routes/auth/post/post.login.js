// Import necessary modules
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { User } = require("../../../models/user/user-model");
const userActiveModel = require("../../../models/user/user-active-model");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { getDateAfter7Days } = require("../../../function/server-user-profile");
const config = require("../../../../../config/config");
const { custom_server_response } = require("../../../function/server-response");

// Minimum password length required
const MIN_PASSWORD_LENGTH = 10;

// Joi schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(MIN_PASSWORD_LENGTH).required(),
});

// Messages for different scenarios
const routeMessage = {
  incorrect_email: "Email not found. Incorrect email.",
  incorrect_password: "Incorrect password.",
  auth_user_login: "User login success.",
};

/**
 * Handles user login.
 */
const businessLogic = async (req, res) => {
  try {
    // Request body
    const { email, password } = req.body;

    // Validate request body
    await loginSchema.validateAsync({ email, password });

    // Find the user by email
    const user = await User.findOne({
      email: email,
      isBlocked: false,
    }).select("-createdAt -updatedAt -__v -isBlocked -isActive");

    // If user not found, return an error response
    if (!user) {
      return custom_server_response(res, 400, routeMessage.incorrect_email);
    }

    // Compare the provided password with the hashed password stored in the user record
    const passwordsMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, return an error response
    if (!passwordsMatch) {
      return custom_server_response(res, 400, routeMessage.incorrect_password);
    }

    // Generate a JWT and send it back to the client
    const token = jwt.sign({ id: user._id }, config.jwt_token, {
      expiresIn: "7d",
    });

    // Hide password and profileImagePublicId for user
    user.password = undefined;
    user.profileImagePublicId = undefined;

    // Calculate JWT expiration date
    const userJwtExpires = await getDateAfter7Days();

    // Create a new userActiveModel
    await userActiveModel.create({
      jwt: token,
      user_id: user._id,
      expires: userJwtExpires,
    });

    const response_data = {
      token,
      user,
    };

    // Return a success response with token and user information
    return custom_server_response(
      res,
      200,
      routeMessage.auth_user_login,
      response_data
    );
  } catch (error) {
    // Handle any unexpected errors
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
