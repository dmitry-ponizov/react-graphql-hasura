import React, { useRef } from "react";
import { useProfilePictureStyles } from "../../styles";
import { Person } from "@material-ui/icons";
import { useMutation } from "@apollo/react-hooks";
import { EDIT_USER_AVATAR } from "../../graphql/mutations";
import handleImageUpload from "../../utils/handleImageUpload";
import { UserContext } from "../../App";

function ProfilePicture({ size, image, isOwner }) {
  const { currentUserId } = React.useContext(UserContext);
  const classes = useProfilePictureStyles({ size, isOwner });
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
  const [img, setImg] = React.useState(image);
  const inputRef = useRef();
  const openFileInput = () => {
    inputRef.current.click();
  };

  async function handleUpdateProfilePic(event) {
    const url = await handleImageUpload(event.target.files[0]);
    const variables = { id: currentUserId, profileImage: url };
    editUserAvatar({ variables });
    setImg(url);
  }

  return (
    <section className={classes.section}>
      <input
        style={{ display: "none" }}
        ref={inputRef}
        type="file"
        onChange={handleUpdateProfilePic}
      />
      {img ? (
        <div
          className={classes.wrapper}
          onClick={isOwner ? openFileInput : () => null}
        >
          <img src={img} alt="user profile" className={classes.image} />
        </div>
      ) : (
        <div className={classes.wrapper}>
          <Person className={classes.person} />
        </div>
      )}
    </section>
  );
}

export default ProfilePicture;
