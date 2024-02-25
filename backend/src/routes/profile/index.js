const express = require("express");
const userAuthorization = require("../../middleware/user-authorization");
const userProfileAdd = require("./put/put.user-profile");
const userProfileImage = require("./put/put.user-profileImage");
const userProfileDataGet = require("./get/get.user-profile");
const userPost = require("./post/post.user-post");
const userStory = require("./post/post.user-story");
const getUserPost = require("./get/get.user-post");
const getUserStory = require("./get/get.user-story");
const deleteUserPost = require("./post/post.post-delete");
const getPostLikesAndComments = require("./get/get.post-statistic");
const deleteUserStory = require("./post/post.story-delete");
const getStoryLikesAndComments = require("./get/get.story-statistic");
const { uploadImageToServer } = require("../../function/server-upload-image");
const { uploadToServer } = require("../../function/server-upload-image-video");

const router = express.Router();

router.get("/", userAuthorization, userProfileDataGet.businessLogic);
router.put(
  "/profile_info_data",
  userAuthorization,
  userProfileAdd.businessLogic
);
router.put(
  "/update_profile_image",
  userAuthorization,
  uploadImageToServer,
  userProfileImage.businessLogic
);
router.post(
  "/add_post",
  userAuthorization,
  uploadToServer,
  userPost.businessLogic
);
router.post(
  "/add_story",
  userAuthorization,
  uploadToServer,
  userStory.businessLogic
);
router.get("/posts", userAuthorization, getUserPost.businessLogic);
router.get("/story", userAuthorization, getUserStory.businessLogic);
router.post("/post/:postId", userAuthorization, deleteUserPost.businessLogic);
router.post(
  "/story/:storyId",
  userAuthorization,
  deleteUserStory.businessLogic
);
router.get(
  "/post-like-comment/:postId",
  userAuthorization,
  getPostLikesAndComments.businessLogic
);
router.get(
  "/story-like-comment/:storyId",
  userAuthorization,
  getStoryLikesAndComments.businessLogic
);

module.exports = router;
