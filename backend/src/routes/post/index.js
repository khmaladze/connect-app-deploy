const express = require("express");
const userAuthorization = require("../../middleware/user-authorization");
const postUserLike = require("./post/post.user-post-like");
const getPostUserLike = require("./get/get.user-post-liked");
const removeUserPostLike = require("./post/post.remove-post-like");
const addComment = require("./post/post.post-comment");
const getComment = require("./get/get.user-post-comment");
const deleteUserPostComment = require("./post/post.post-delete-comment");
const getUserFriendsPost = require("./get/get.user-post");

const router = express.Router();

router.get("/", userAuthorization, getUserFriendsPost.businessLogic);
router.post("/like_post", userAuthorization, postUserLike.businessLogic);
router.get(
  "/check_post_like/:postId",
  userAuthorization,
  getPostUserLike.businessLogic
);
router.post(
  "/remove_post_like",
  userAuthorization,
  removeUserPostLike.businessLogic
);
router.post("/comment", userAuthorization, addComment.businessLogic);
router.get("/comment", userAuthorization, getComment.businessLogic);
router.post(
  "/comment/:postId",
  userAuthorization,
  deleteUserPostComment.businessLogic
);

module.exports = router;
