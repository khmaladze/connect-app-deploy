const express = require("express");
const userAuthorization = require("../../middleware/user-authorization");
const storieUserLike = require("../story/post/post.user-story-like");
const storieUserStoryView = require("../story/post/post.story-view");
const getStoryUserLike = require("./get/get.user-story-liked");
const removeUserStoryLike = require("./post/post.remove-story-like");
const addStoryComment = require("./post/post.add-story-comment");
const getStoryComment = require("./get/get.user-story-comment");
const deleteUserStoryComment = require("./post/post.story-delete-comment");
const getUserFriendsStory = require("./get/get.user-story");

const router = express.Router();

router.get("/", userAuthorization, getUserFriendsStory.businessLogic);
router.post("/like_story", userAuthorization, storieUserLike.businessLogic);
router.post(
  "/story_view",
  userAuthorization,
  storieUserStoryView.businessLogic
);
router.get(
  "/check_story_like/:storyId",
  userAuthorization,
  getStoryUserLike.businessLogic
);
router.post(
  "/remove_story_like",
  userAuthorization,
  removeUserStoryLike.businessLogic
);
router.post("/comment", userAuthorization, addStoryComment.businessLogic);
router.get("/comment", userAuthorization, getStoryComment.businessLogic);
router.post(
  "/comment/:storyId",
  userAuthorization,
  deleteUserStoryComment.businessLogic
);

module.exports = router;
