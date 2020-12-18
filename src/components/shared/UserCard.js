import React from "react";
import { useUserCardStyles } from "../../styles";
import { Link } from "react-router-dom";
import { Avatar, Typography } from "@material-ui/core";

function UserCard(props) {
  const classes = useUserCardStyles({ avatarSize: props.avatarSize });
  return (
    <div className={classes.wrapper}>
      <Link to={`/${props.user?.username}`}>
        <Avatar
          src={props.user?.profile_image}
          alt="User avatar"
          className={classes.avatar}
        />
      </Link>
      <div className={classes.nameWrapper}>
        <Link to={`/${props.user?.username}`}>
          <Typography variant="subtitle2" className={classes.typography}>
            {props.user?.username}
          </Typography>
        </Link>
        <Typography
          color="textSecondary"
          variant="body2"
          className={classes.typography}
        >
          {props?.location || props.user?.name}
        </Typography>
      </div>
    </div>
  );
}

export default UserCard;
