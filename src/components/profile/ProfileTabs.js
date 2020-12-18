import {
  Divider,
  Grid,
  Hidden,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import React from "react";
import { GridIcon, SaveIcon } from "../../icons";
import { useProfilePageStyles, useProfileTabsStyles } from "../../styles";
import GridPost from "../shared/GridPost";

function ProfileTabs({ user, isOwner }) {
  const classes = useProfileTabsStyles();
  const [value, setValue] = React.useState(0);

  return (
    <>
      <section className={classes.section}>
        <Hidden xsDown>
          <Divider />
        </Hidden>
        <Hidden xsDown>
          <Tabs
            value={value}
            onChange={(_, value) => setValue(value)}
            centered
            classes={{ indicator: classes.tabsIndicator }}
          >
            <Tab
              label="POSTS"
              classes={{
                root: classes.tabRoot,
                labelIcon: classes.tabLabelIcon,
                wrapper: classes.tabWrapper,
              }}
              icon={<span className={classes.postsIconLarge} />}
            />
            {isOwner && (
              <Tab
                label="SAVED"
                classes={{
                  root: classes.tabRoot,
                  labelIcon: classes.tabLabelIcon,
                  wrapper: classes.tabWrapper,
                }}
                icon={<span className={classes.savedIconLarge} />}
              />
            )}
          </Tabs>
        </Hidden>
        <Hidden smUp>
          <Tabs
            value={value}
            onChange={(_, value) => setValue(value)}
            centered
            className={classes.tabs}
            classes={{ indicator: classes.tabsIndicator }}
          >
            <Tab
              icon={
                <GridIcon
                  fill={value === 0 ? "#3897f0" : undefined}
                  classes={{ root: classes.root }}
                />
              }
            />
            {isOwner && (
              <Tab
                icon={
                  <SaveIcon
                    fill={value === 1 ? "#3897f0" : undefined}
                    classes={{ root: classes.root }}
                  />
                }
              />
            )}
          </Tabs>
        </Hidden>
        <Hidden smUp>{user.posts.length === 0 && <Divider />}</Hidden>
        {value === 0 ? (
          <ProfilePost user={user} isOwner={isOwner} />
        ) : (
          <SavedPost user={user} />
        )}
      </section>
    </>
  );
}

function ProfilePost({ user, isOwner }) {
  const classes = useProfileTabsStyles();
  if (user.posts.length === 0) {
    return (
      <section className={classes.profilePostsSection}>
        <div className={classes.noContent}>
          <div className={classes.uploadPhotoIcon} />
          <Typography variant="h4">
            {isOwner ? "Upload a Photo" : "No photos"}
          </Typography>
        </div>
      </section>
    );
  }

  return (
    <article className={classes.article}>
      <div className={classes.postContainer}>
        {user.posts.map((post) => (
          <GridPost key={post.id} post={post} />
        ))}
      </div>
    </article>
  );
}

function SavedPost({ user }) {
  const classes = useProfileTabsStyles();
  if (user.saved_posts.length === 0) {
    return (
      <section className={classes.savedPostsSection}>
        <div className={classes.noContent}>
          <div className={classes.savePhotoIcon} />
          <Typography variant="h4">Save</Typography>
          <Typography align="center">Save photo and videos .....</Typography>
        </div>
      </section>
    );
  }

  return (
    <article className={classes.article}>
      <div className={classes.postContainer}>
        {user.saved_posts.map(({ post }) => (
          <GridPost key={post.id} post={post} />
        ))}
      </div>
    </article>
  );
}

export default ProfileTabs;
