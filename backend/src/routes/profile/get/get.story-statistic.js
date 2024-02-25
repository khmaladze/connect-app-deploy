const { User } = require("../../../models/user/user-model");
const {
  customServerError,
} = require("../../../function/server-custom-error-response");
const { custom_server_response } = require("../../../function/server-response");
const StoryCommentModel = require("../../../models/story/story-comment-model");
const Story = require("../../../models/story/story-model");
const StoryLike = require("../../../models/story/story-like-model");
const StoryView = require("../../../models/story/story-view");

const routeMessages = {
  get_story_likes_and_comment_success: "get story likes and comment success",
  not_auth_user: "You are not authorized to view likes for this story",
  story_not_found: "story not found",
};

const businessLogic = async (req, res) => {
  try {
    const storyId = req.params.storyId;

    const story = await Story.findById(storyId);
    if (!story) {
      return custom_server_response(res, 404, routeMessages.story_not_found);
    }

    if (req.user._id.toString() !== story.author.toString()) {
      return custom_server_response(res, 400, routeMessages.not_auth_user);
    }

    const likes = await StoryLike.find({ story_id: storyId });

    const likesWithUserInfo = await Promise.all(
      likes.map(async (like) => {
        const user = await User.findById(like.like_author_id).select(
          "username profileImage gender"
        );
        return {
          user_id: user?._id,
          username: user?.username,
          profileImage: user?.profileImage,
          gender: user?.gender,
          createdAt: like.createdAt,
          updatedAt: like.updatedAt,
        };
      })
    );

    const comments = await StoryCommentModel.find({ story_id: storyId });

    const commentsWithUserInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findById(comment.author_id).select(
          "username profileImage gender"
        );
        return {
          user_id: user?._id,
          username: user?.username,
          profileImage: user?.profileImage,
          gender: user?.gender,
          comment_text: comment.comment,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        };
      })
    );

    const storyViews = await StoryView.find({ story_id: storyId });

    const storyViewsWithUserInfo = await Promise.all(
      storyViews.map(async (storyView) => {
        const user = await User.findById(storyView.view_author_id).select(
          "username profileImage gender"
        );
        return {
          user_id: user?._id,
          username: user?.username,
          profileImage: user?.profileImage,
          gender: user?.gender,
          createdAt: storyView.createdAt,
          updatedAt: storyView.updatedAt,
        };
      })
    );

    const likesAndCommentsAndViewsData = {
      likes: {
        count: likesWithUserInfo.length,
        data: likesWithUserInfo,
      },
      comments: {
        count: commentsWithUserInfo.length,
        data: commentsWithUserInfo,
      },
      views: {
        count: storyViewsWithUserInfo.length,
        data: storyViewsWithUserInfo,
      },
    };

    return custom_server_response(
      res,
      200,
      routeMessages.get_story_likes_and_comment_success,
      likesAndCommentsAndViewsData
    );
  } catch (error) {
    console.error("Error retrieving likes and comments:", error);
    return customServerError(res, error);
  }
};

module.exports = { businessLogic };
