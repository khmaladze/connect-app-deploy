const express = require("express");
const userAuthorization = require("../../middleware/user-authorization");
const sendFriendRequest = require("./post/post.friend-request");
const getUserProfile = require("./get/get.user-profile");
const getFriendRequest = require("./get/get.friend-request");
const getSendRequest = require("./get/get.send-request");
const getFriendList = require("./get/get.friendList");
const responseFriendRequest = require("./put/put.friend-request-response");
const removeSentFriendRequest = require("./put/put.remove-friend-request");
const removeUserFromFriendList = require("./put/put.remove-friendList");
const updateFriendList = require("./put/put.update-friend-list");

const router = express.Router();

router.post(
  "/send_friend_request",
  userAuthorization,
  sendFriendRequest.businessLogic
);
router.get("/user/:username", userAuthorization, getUserProfile.businessLogic);
router.get("/", userAuthorization, getFriendList.businessLogic);
router.get("/request", userAuthorization, getFriendRequest.businessLogic);
router.get(
  "/get_send_request",
  userAuthorization,
  getSendRequest.businessLogic
);
router.put("/response", userAuthorization, responseFriendRequest.businessLogic);
router.put(
  "/remove_request",
  userAuthorization,
  removeSentFriendRequest.businessLogic
);
router.put(
  "/remove",
  userAuthorization,
  removeUserFromFriendList.businessLogic
);
router.put(
  "/update-friend-list",
  userAuthorization,
  updateFriendList.businessLogic
);

module.exports = router;
