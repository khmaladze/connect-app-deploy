const express = require("express");
const userAuthorization = require("../../middleware/user-authorization");
const sendMessage = require("./post/post.send-message");
const getMessage = require("./get/get.user-message");
const getUser = require("./get/get.user");

const router = express.Router();

router.post("/", userAuthorization, sendMessage.businessLogic);
router.get("/:friendId", userAuthorization, getMessage.businessLogic);
router.get("/user/:friendId", userAuthorization, getUser.businessLogic);

module.exports = router;
