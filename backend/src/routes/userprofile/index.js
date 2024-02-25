const express = require("express");
const userAuthorization = require("../../middleware/user-authorization");
const userProfileDataGet = require("./get/get.user-profile");
const router = express.Router();

router.get("/:profileId", userAuthorization, userProfileDataGet.businessLogic);

module.exports = router;
