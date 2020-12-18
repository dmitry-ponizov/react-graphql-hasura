import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { useFollowButtonStyles } from "../../styles";
import { UserContext } from "../../App";
import { FOLLOW_USER, UNFOLLOW_USER } from "../../graphql/mutations";
import { useMutation } from "@apollo/react-hooks";

function FollowButton({ side, id }) {
  const classes = useFollowButtonStyles({ side });
  const { currentUserId, followingIds } = React.useContext(UserContext);
  const isAlreadyFollowing = followingIds.some(
    (followingId) => followingId === id
  );
  const [isFollow, setFollow] = useState(isAlreadyFollowing);
  const variables = {
    userIdToFollow: id,
    currentUserId,
  };
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  const handleFollowUser = () => {
    setFollow(true);
    followUser({ variables });
  };

  const handleUnfollowUser = () => {
    setFollow(false);
    unfollowUser({ variables });
  };

  const followButton = (
    <Button
      variant={side ? "text" : "contained"}
      color="primary"
      className={classes.button}
      onClick={handleFollowUser}
      fullWidth
    >
      Follow
    </Button>
  );

  const followingButton = (
    <Button
      variant={side ? "text" : "outlined"}
      className={classes.button}
      onClick={handleUnfollowUser}
      fullWidth
    >
      Following
    </Button>
  );

  return isFollow ? followingButton : followButton;
}

export default FollowButton;
