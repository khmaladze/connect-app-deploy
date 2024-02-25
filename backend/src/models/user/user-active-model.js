const { Schema, model } = require("mongoose");

// Enum representing different user active status types
const UserActiveStatusEnum = {
  Active: "Active",
  Blocked: "Blocked",
  LogOut: "LogOut",
};

// Schema for the UserActive model
const userActiveSchema = new Schema(
  {
    jwt: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(UserActiveStatusEnum),
      default: UserActiveStatusEnum.Active,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expires: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically add timestamps for 'createdAt' and 'updatedAt'
);

// Create the UserActive model from the schema
module.exports = model("UserActive", userActiveSchema);
