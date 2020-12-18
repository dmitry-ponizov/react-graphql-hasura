import {
  Button,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Slide,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useEditProfilePageStyles } from "../styles";
import { Menu } from "@material-ui/icons";
import Layout from "../components/shared/Layout";
// import { defaultCurrentUser } from "../data";
import ProfilePicture from "../components/shared/ProfilePicture";
import { UserContext } from "../App";
import { GET_EDIT_USER_PROFILE } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useForm } from "react-hook-form";
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import { EDIT_USER, EDIT_USER_AVATAR } from "../graphql/mutations";
import { auth } from "firebase";
import { AuthContext } from "../auth";
import handleImageUpload from "../utils/handleImageUpload";

function EditProfilePage({ history }) {
  const classes = useEditProfilePageStyles();
  const path = history.location.pathname;
  const [showDrawer, setDrawer] = React.useState(false);
  const { currentUserId } = React.useContext(UserContext);
  const variables = { id: currentUserId };
  const { data, loading } = useQuery(GET_EDIT_USER_PROFILE, { variables });
  const handleToggleDrawer = () => {
    setDrawer((prev) => !prev);
  };

  if (loading) return <LoadingScreen />;
  const handleSelected = (index) => {
    switch (index) {
      case 0:
        return path.includes("edit");
      default:
        break;
    }
  };

  const handleListClick = (index) => {
    switch (index) {
      case 0:
        history.push("/accounts/edit");
        break;
      default:
        break;
    }
  };

  const options = [
    "Edit Profile",
    "Change password",
    "Apps and Websites",
    "Email and SMS",
    "Push Notifications",
    "Manage Contacts",
    "Privacy and Security",
    "Login Activity",
    "Emails from Instagram",
  ];
  const drawer = (
    <List>
      {options.map((option, index) => (
        <ListItem
          key={option}
          selected={handleSelected(index)}
          onClick={() => handleListClick(index)}
          classes={{
            selected: classes.listItemSelected,
            button: classes.listItemButton,
          }}
        >
          <ListItemText primary={option}></ListItemText>
        </ListItem>
      ))}
    </List>
  );
  return (
    <Layout title="Edit Profile">
      <section className={classes.section}>
        <IconButton
          edge="start"
          onClick={handleToggleDrawer}
          className={classes.menuButton}
        >
          <Menu />
        </IconButton>
        <nav>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="left"
              open={showDrawer}
              onClose={handleToggleDrawer}
              classes={{ paperAnchorLeft: classes.temporaryDrawer }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden
            xsDown
            implementation="css"
            className={classes.permanentDrawerRoot}
          >
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.permanentDrawerPaper,
                root: classes.permanentDrawerRoot,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main>
          {path.includes("edit") && <EditUserInfo user={data.users_by_pk} />}
        </main>
      </section>
    </Layout>
  );
}

function EditUserInfo({ user }) {
  const classes = useEditProfilePageStyles();
  const { register, handleSubmit } = useForm({ mode: "onBlur" });
  const [editUser] = useMutation(EDIT_USER);
  const { updateEmail } = React.useContext(AuthContext);
  const [error, setError] = React.useState({ type: "", message: "" });
  const [open, setOpen] = React.useState(false);
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
  const [profileImage, setProfileImage] = React.useState(user.profile_image);

  function handleError(error) {
    if (error.message.includes("users_username_key")) {
      setError({ type: "username", message: "Username already taken" });
    } else if (error.code.includes("auth")) {
      setError({ message: error.message, type: "email" });
    }
  }
  const onSubmit = async (data) => {
    try {
      setError({ message: "", type: "" });
      const variables = { ...data, id: user.id };
      await updateEmail(data.email);
      await editUser({ variables });
      setOpen(true);
    } catch (e) {
      handleError(e);
    }
  };

  async function handleUpdateProfilePic(event) {
    const url = await handleImageUpload(event.target.files[0]);
    const variables = { id: user.id, profileImage: url };
    editUserAvatar({ variables });
    setProfileImage(url);
  }

  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture size={38} image={profileImage} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            {user.username}
          </Typography>
          <input
            accept="image/*"
            id="image"
            type="file"
            style={{ display: "none" }}
            onChange={handleUpdateProfilePic}
          />
          <label htmlFor="image">
            <Typography
              color="primary"
              variant="body2"
              className={classes.typographyChangePic}
            >
              Change Profile Photo
            </Typography>
          </label>
        </div>
      </div>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <SectionItem
          name="name"
          inputRef={register({ required: true, minLength: 5, maxLength: 20 })}
          text="Name"
          formItem={user.name}
        />
        <SectionItem
          name="username"
          error={error}
          inputRef={register({
            required: true,
            pattern: /^[a-zA-Z0-9_.]*$/,
            minLength: 5,
            maxLength: 20,
          })}
          text="Username"
          formItem={user.username}
        />
        <SectionItem
          text="Website"
          formItem={user.website}
          name="website"
          inputRef={register({
            validate: (input) =>
              Boolean(input)
                ? isURL(input, {
                    protocols: ["http", "https"],
                    require_protocol: true,
                  })
                : true,
          })}
        />
        <div className={classes.sectionItem}>
          <aside>
            <Typography>Bio</Typography>
          </aside>
          <TextField
            variant="outlined"
            multiline
            rowsMax={3}
            rows={3}
            fullWidth
            name="bio"
            inputRef={register({
              maxLength: 120,
            })}
            defaultValue={user.bio}
          />
        </div>
        <div className={classes.sectionItem}>
          <div />
          <Typography
            color="textSecondary"
            className={classes.justifySelfStart}
          >
            Personal information{" "}
          </Typography>
        </div>
        <SectionItem
          name="phoneNumber"
          inputRef={register({
            validate: (input) => (Boolean(input) ? isMobilePhone(input) : true),
          })}
          text="Phone Number"
          formItem={user.phone_number}
        />
        <SectionItem
          text="Email"
          inputRef={register({
            required: true,
            validate: (input) => isEmail(input),
          })}
          formItem={user.email}
          name="email"
          error={error}
          type="email"
        />
        <div className={classes.sectionItem}>
          <div />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.justifySelfStart}
          >
            Submit
          </Button>
        </div>
      </form>
      <Snackbar
        message={<span>Profile updated</span>}
        open={open}
        autoHideDuration={6000}
        TransitionComponent={Slide}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}

function SectionItem({ type = "text", text, formItem, inputRef, name, error }) {
  const classes = useEditProfilePageStyles();
  return (
    <div className={classes.sectionItemWrapper}>
      <aside>
        <Hidden xsDown>
          <Typography className={classes.typography} align="right">
            {text}
          </Typography>
        </Hidden>
        <Hidden smUp>
          <Typography className={classes.typography}>{text}</Typography>
        </Hidden>
      </aside>
      <TextField
        name={name}
        variant="outlined"
        inputRef={inputRef}
        fullWidth
        helperText={error?.type === "name" && error.message}
        defaultValue={formItem}
        type={type}
        inputProps={{ className: classes.textFieldInput }}
        className={classes.textField}
      />
    </div>
  );
}

export default EditProfilePage;
