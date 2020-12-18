import React from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  Divider,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { UserContext } from "../../App";
import { ArrowBackIos, PinDrop } from "@material-ui/icons";
import serialize from "../../utils/serialize";
import handleImageUpload from "../../utils/handleImageUpload";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_POST } from "../../graphql/mutations";

const useAddPostDialogStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    background: "#fff !important",
    color: "black !important",
    display: "flex",
    justifyContent: "space-between",
    height: "54px !important",
  },
  toolbar: {
    minHeight: "54px !important",
  },
  title: {
    flex: 1,
    fontWeight: 600,
  },
  paper: {
    display: "flex",
    alignItems: "flex-start",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  editor: {
    flex: 1,
  },
  avatarLarge: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  input: {
    padding: "10px !important",
    fontSize: "14px !important",
  },
  root: {
    border: "1px solid #e6e6e6",
    marginTop: "10px !important",
  },
  underline: {
    "&::before": {
      border: "none !important",
    },
    "&::after": {
      border: "none !important",
    },
    "&::hover&:before": {
      border: "none !important",
    },
  },
}));

const initialValue = [{ type: "paragraph", children: [{ text: "" }] }];

function AddPostDialog({ media, handleClose }) {
  const classes = useAddPostDialogStyles();
  const editor = React.useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = React.useState(initialValue);
  const { me, currentUserId } = React.useContext(UserContext);
  const [location, setLocation] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [createPost] = useMutation(CREATE_POST);

  async function handleSharePost() {
    setSubmitting(true);
    const url = await handleImageUpload(media);
    const variables = {
      caption: serialize({ children: value }),
      userId: currentUserId,
      media: url,
      location,
    };
    await createPost({ variables });
    setSubmitting(false);
    window.location.reload();
  }

  return (
    <Dialog fullScreen open onClose={handleClose}>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <ArrowBackIos onClick={handleClose} />
          <Typography align="center" variant="body1" className={classes.title}>
            New Post
          </Typography>
          <Button
            color="primary"
            className={classes.share}
            disable={submitting}
            onClick={handleSharePost}
          >
            Share
          </Button>
        </Toolbar>
      </AppBar>
      <Divider />
      <Paper className={classes.paper}>
        <Avatar src={me.profile_image} />
        <Slate
          editor={editor}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <Editable
            className={classes.editor}
            placeholder={"Write your caption..."}
          />
        </Slate>
        <Avatar
          src={URL.createObjectURL(media)}
          className={classes.avatarLarge}
          variant="square"
        />
      </Paper>
      <TextField
        fullWidth
        placeholder="Location"
        InputProps={{
          classes: {
            root: classes.root,
            input: classes.input,
            underline: classes.underline,
          },
          startAdornment: (
            <InputAdornment>
              <PinDrop />
            </InputAdornment>
          ),
        }}
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      />
    </Dialog>
  );
}

export default AddPostDialog;
