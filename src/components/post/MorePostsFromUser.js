import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { useMorePostsFromUserStyles } from "../../styles";
import { getDefaultPost, defaultUser } from "../../data";
import GridPost from "../shared/GridPost";
import { LoadingLargeIcon } from "../../icons";
import { Link } from "react-router-dom";
import { GET_MORE_POSTS_FROM_USER, GET_POST } from "../../graphql/queries";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";

function MorePostFromUser({ postId }) {
  const variables = { postId };
  const { data, loading } = useQuery(GET_POST, { variables });
  const classes = useMorePostsFromUserStyles();

  const [
    getMorePostsFromUser,
    { data: morePosts, loading: loadingPosts },
  ] = useLazyQuery(GET_MORE_POSTS_FROM_USER);

  React.useEffect(() => {
    if (loading) return;
    const userId = data?.posts_by_pk.users.id;
    const postId = data?.posts_by_pk.id;
    const variables = { userId, postId };
    getMorePostsFromUser({ variables });
  }, [data, loading, getMorePostsFromUser]);

  return (
    <div className={classes.container}>
      {loading || loadingPosts ? (
        <LoadingLargeIcon />
      ) : (
        <>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            component="h2"
            gutterBottom
            className={classes.typography}
          >
            More post from{" "}
            <Link
              to={`/${data.posts_by_pk.users.username}`}
              className={classes.link}
            >
              @{data.posts_by_pk.users.username}
            </Link>
          </Typography>
          <article className={classes.article}>
            <div className={classes.postContainer}>
              {morePosts?.posts.map((post) => (
                <GridPost key={post.id} post={post} />
              ))}
            </div>
          </article>
        </>
      )}
    </div>
  );
}

export default MorePostFromUser;
