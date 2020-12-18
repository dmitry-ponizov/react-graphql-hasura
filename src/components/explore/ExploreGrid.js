import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { useExploreGridStyles } from "../../styles";
import { getDefaultPost } from "../../data";
import GridPost from "../shared/GridPost";
import { LoadingLargeIcon } from "../../icons";
import { EXPLORE_POSTS } from "../../graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { UserContext } from "../../App";

function ExploreGrid() {
  const classes = useExploreGridStyles();
  const { followingIds } = React.useContext(UserContext);
  const variables = {
    followingIds,
  };
  const { loading, data } = useQuery(EXPLORE_POSTS, { variables });
  console.log(data);
  return (
    <>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        component="h2"
        gutterBottom
        className={classes.typography}
      >
        Explore
      </Typography>
      {loading ? (
        <LoadingLargeIcon />
      ) : (
        <article className={classes.article}>
          <div className={classes.postContainer}>
            {data.posts.map((post) => (
              <GridPost key={post.id} post={post} />
            ))}
          </div>
        </article>
      )}
    </>
  );
}

export default ExploreGrid;
