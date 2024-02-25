const express = require("express");
const getUserActivelog = require("./get/get.user-active-log");
const updateUserPassword = require("./put/put.user-password-update");
const userAuthorization = require("../../middleware/user-authorization");
const router = express.Router();

router.get("/active_log", userAuthorization, getUserActivelog.businessLogic);
router.put(
  "/update_password",
  userAuthorization,
  updateUserPassword.businessLogic
);

module.exports = router;
