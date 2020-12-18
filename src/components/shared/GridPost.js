import { Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { useGridPostStyles } from "../../styles";

function GridPost({ post }) {
  const history = useHistory();
  const classes = useGridPostStyles();
  const handleOpenPostModal = () => {
    history.push({
      pathname: `/p/${post.id}`,
      state: { modal: true },
    });
  };

  const commentsCount =
    !!post.comments_aggregate && post.comments_aggregate.aggregate
      ? post.comments_aggregate.aggregate.count
      : 0;
  const likesCount = !!post.likes_aggregate
    ? post.likes_aggregate.aggregate.count
    : 0;

  return (
    <div onClick={handleOpenPostModal} className={classes.gridPostContainer}>
      <div className={classes.gridPostOverlay}>
        <div className={classes.gridPostInfo}>
          <span className={classes.likes} />
          <Typography>{likesCount}</Typography>
        </div>
        <div className={classes.gridPostInfo}>
          <span className={classes.comments} />
          <Typography>{commentsCount}</Typography>
        </div>
      </div>
      <img src={post.media} alt="Post cover" className={classes.image} />
    </div>
  );
}

export default GridPost;
