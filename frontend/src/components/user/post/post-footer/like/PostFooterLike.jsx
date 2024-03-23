import React, { Fragment, useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { apiRequest, apiRequestType } from "../../../../../api/user/Api";
import { API_URL } from "../../../../../config/config";

const PostFooterLike = ({ token, postId, isLiked }) => {
  const [like, setLike] = useState(isLiked);
  const [checkLike, setCheckLike] = useState(false);

  const likePost = async () => {
    try {
      setLike(true);
      const response = await apiRequest(
        apiRequestType.post,
        false,
        API_URL.post.post.like_post,
        token,
        {
          post_id: postId,
        }
      );
      if (response?.success) {
        setLike(true);
        setCheckLike(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removePostLike = async () => {
    try {
      const response = await apiRequest(
        apiRequestType.post,
        false,
        API_URL.post.post.remove_post_like,
        token,
        { post_id: postId }
      );
      if (response?.success) {
        setLike(false);
        setCheckLike(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkIsPostLiked = async () => {
      try {
        const response = await apiRequest(
          apiRequestType.get,
          false,
          API_URL.post.get.check_post_like + "/" + postId,
          token
        );
        if (response?.success) {
          setLike(response.data.liked);
        }
      } catch (error) {
        console.log(error);
      }
    };
    setTimeout(() => {
      if (checkLike) {
        checkIsPostLiked();
        setCheckLike(false);
      }
    }, 1000);
  }, [like]);

  return (
    <Fragment>
      {like ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <FavoriteIcon
            onClick={() => {
              removePostLike();
            }}
          />
        </div>
      ) : (
        <FavoriteBorderIcon
          onClick={() => {
            likePost();
          }}
        />
      )}
    </Fragment>
  );
};

export default PostFooterLike;
