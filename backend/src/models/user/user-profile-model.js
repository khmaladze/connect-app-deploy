const mongoose = require("mongoose");
const { userProfileData } = require("../../data/user-profile");

// Define the schema for the UserProfile model
const userProfileSchema = new mongoose.Schema(
  {
    languages: {
      type: [String],
      enum: userProfileData.languages, // Use enum for valid language values
    },
    zodiac: {
      type: String,
      enum: userProfileData.zodiac, // Use enum for valid zodiac values
    },
    education: {
      type: String,
      enum: userProfileData.education, // Use enum for valid education values
    },
    passions: {
      type: [String],
      enum: userProfileData.passions, // Use enum for valid passion values
    },
    user_profile_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Create the UserProfile model from the schema
const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = { UserProfile };
