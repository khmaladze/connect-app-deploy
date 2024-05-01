const express = require("express");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const CommentModel = require("../../../models/story/story-comment-model");
const {
  deleteFileFromCloudinary,
} = require("../../../function/server-file-delete");
const { StoryLike } = require("../../../models/story/story-like-model");
const Story = require("../../../models/story/story-model");

const routeMessages = {
  story_not_found_or_unauthorized:
    "story not found or user not authorized to delete.",
  story_deleted_successfully: "story deleted successfully.",
  internal_server_error: "Internal Server Error.",
};

// Define a function to delete data
const deleteStoryLikeCommentData = async (parameter) => {
  try {
    // Find and delete documents that match the parameter
    const resultLike = await StoryLike.deleteMany(parameter);
    const resultCommennt = await CommentModel.deleteMany(parameter);
    if (!resultLike || !resultCommennt) {
      console.log("No document found matching the parameter.");
    } else {
      console.log("Document deleted successfully:", resultLike, resultCommennt);
    }
  } catch (error) {
    console.error("Error deleting document:", error);
  }
};

const businessLogic = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const authorId = req.user._id;

    const deletedStoryFile = await Story.findOneAndDelete({
      _id: storyId,
      author: authorId,
    }).select("media");

    if (!deletedStoryFile) {
      return custom_server_response(
        res,
        404,
        routeMessages.story_not_found_or_unauthorized
      );
    }

    if (deletedStoryFile.media.length > 0) {
      const mediaType =
        deletedStoryFile.media[0].url.slice(-3) === "mp4" ? "video" : "image";
      await deleteFileFromCloudinary(
        deletedStoryFile.media[0].public_id,
        mediaType
      );
    }
    console.log("here");

    // Define the parameter based on which you want to delete data
    const parameter = { story_id: storyId };

    // Call the function to delete data
    await deleteStoryLikeCommentData(parameter);

    return custom_server_response(
      res,
      200,
      routeMessages.story_deleted_successfully
    );
  } catch (error) {
    console.error(error);
    return customServerError(res, routeMessages.internal_server_error);
  }
};

module.exports = { businessLogic };
