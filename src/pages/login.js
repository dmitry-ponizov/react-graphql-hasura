import {
  Button,
  Card,
  CardHeader,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useLoginPageStyles } from "../styles";
import { Link, useHistory } from "react-router-dom";
import SEO from "../components/shared/Seo";
import FacebookIconBlue from "../images/facebook-icon-blue.svg";
import FacebookIconWhite from "../images/facebook-icon-white.png";
import { useForm } from "react-hook-form";
import { AuthContext } from "../auth";
import isEmail from "validator/lib/isEmail";
import { useApolloClient } from "@apollo/react-hooks";
import { GET_USER_EMAIL } from "../graphql/queries";
import { AuthError } from "./signup";

function LoginPage() {
  const classes = useLoginPageStyles();
  const { register, handleSubmit, watch, formState } = useForm({
    mode: "onBlur",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const { loginWithEmailAndPassword } = React.useContext(AuthContext);
  const history = useHistory();
  const [error, setError] = React.useState("");

  const client = useApolloClient();

  const hasPassword = Boolean(watch("password"));

  const onSubmit = async (data) => {
    try {
      setError("");
      if (!isEmail(data.input)) {
        data.input = await getUserEmail(data.input);
      }
      await loginWithEmailAndPassword(data.input, data.password);
      setTimeout(() => history.push("/"), 1000);
    } catch (e) {
      handleError(e);
    }
  };

  function handleError(error) {
    if (error.code.includes("auth")) {
      setError(error.message);
    }
  }

  async function getUserEmail(input) {
    const variables = { input };
    const response = await client.query({
      query: GET_USER_EMAIL,
      variables,
    });

    const userEmail = response.data.users[0]?.email || "no@email.com";
    return userEmail;
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <>
      <SEO title="login"></SEO>
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <CardHeader className={classes.cardHeader} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="input"
                inputRef={register({
                  required: true,
                  minLength: 5,
                })}
                fullWidth
                variant="filled"
                label="Username, email, or phone"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
              />
              <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                inputRef={register({
                  required: true,
                  minLength: 5,
                })}
                fullWidth
                variant="filled"
                label="Password"
                margin="dense"
                className={classes.textField}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: hasPassword && (
                    <InputAdornment>
                      <Button onClick={togglePasswordVisibility}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                disabled={!formState.isValid || formState.isSubmitting}
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
              >
                Log in
              </Button>
            </form>
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <AuthError error={error} />
            <LoginWithFacebook color="secondary" iconColor="blue" />
            <Button fullWidth color="secondary">
              <Typography variant="caption">Forgot password</Typography>
            </Button>
          </Card>
          <Card className={classes.signUpCard}>
            <Typography align="right" variant="body2">
              Don`t have an account?
            </Typography>
            <Link to="/accounts/emailsignup">
              <Button color="primary" className={classes.signUpButton}>
                Sign up
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </>
  );
}

export function LoginWithFacebook({ color, iconColor, variant }) {
  const classes = useLoginPageStyles();
  const icon = iconColor === "blue" ? FacebookIconBlue : FacebookIconWhite;
  const { logInWithGoogle } = React.useContext(AuthContext);
  const [error, setError] = React.useState();
  const history = useHistory();

  const handleLoginWithGoogle = async () => {
    try {
      await logInWithGoogle();
      setTimeout(() => history.push("/"), 0);
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <>
      <Button
        onClick={handleLoginWithGoogle}
        fullWidth
        color={color}
        variant={variant}
      >
        <img src={icon} alt="facebook icon" className={classes.facebookIcon} />
        Login with facebook
      </Button>
      <AuthError error={error} />
    </>
  );
}

export default LoginPage;
