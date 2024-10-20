import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signUp,
  signIn,
  doesEmailExist,
} from "supertokens-web-js/recipe/emailpassword";
import { useAuth } from "./AuthenticationContext";
import OrganizationSelection from "./OrganizationSelection";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
  Slide,
} from "@mui/material";

const Authentication = () => {
  const { email, setEmail, firstName, setFirstName, lastName, setLastName } =
    useAuth();

  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputError, setInputError] = useState({
    email: false,
    password: false,
  });
  const [showOrgSelection, setShowOrgSelection] = useState(false);

  const navigate = useNavigate();

  const signUpClicked = async () => {
    try {
      let response = await signUp({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password },
        ],
      });

      setInputError({ email: false, password: false });

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            setErrorMessage(formField.error);
            setInputError((prev) => ({ ...prev, email: true }));
          } else if (formField.id === "password") {
            setErrorMessage(formField.error);
            setInputError((prev) => ({ ...prev, password: true }));
          }
        });
      } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
        setErrorMessage(response.reason);
        setInputError((prev) => ({ ...prev, email: true }));
      } else {
        setErrorMessage("");
        setShowOrgSelection(true);
      }
    } catch (err) {
      setErrorMessage("Oops! Something went wrong.");
      console.log("err", err);
      setInputError({ email: true, password: true });
    }
  };

  const signInClicked = async () => {
    try {
      let response = await signIn({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password },
        ],
      });

      setInputError({ email: false, password: false });

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            setErrorMessage(formField.error);
            setInputError((prev) => ({ ...prev, email: true }));
          } else if (formField.id === "password") {
            setErrorMessage(formField.error);
            setInputError((prev) => ({ ...prev, password: true }));
          }
        });
      } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
        setErrorMessage("Email password combination is incorrect.");
        setInputError({ email: true, password: true });
      } else {
        setErrorMessage("");
        navigate("/auth/fetch");
      }
    } catch (err) {
      setErrorMessage("Oops! Something went wrong.");
      setInputError({ email: true, password: true });
    }
  };

  const checkEmail = async () => {
    try {
      let response = await doesEmailExist({ email });
      if (response.doesExist) {
        setErrorMessage("This email already exists. Please sign in instead.");
        setInputError({ email: true, password: false });
      }
    } catch (err) {
      setErrorMessage("Oops! Something went wrong.");
      setInputError({ email: true, password: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setInputError({ email: false, password: false });

    if (isSignUp) {
      await checkEmail();
      await signUpClicked();
    } else {
      await signInClicked();
    }
  };

  // TODO ask reyaaz, what is this func supposed to do?
  const handleOrgSubmit = async (orgData: any) => {
    console.log("Organization data:", orgData);
  };

  const handleBackToAuth = () => {
    setShowOrgSelection(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        component="main"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "50%",
          }}
        >
          <img
            src="/assets/logo-nobg.png"
            alt="EFF BI Logo"
            style={{ width: "128px" }}
          />

          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            <Slide
              direction="right"
              in={!showOrgSelection}
              mountOnEnter
              unmountOnExit
            >
              <Box>
                <Typography component="h1" variant="h5">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Typography>
                {errorMessage && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {errorMessage}
                  </Typography>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={inputError.email}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={inputError.password}
                  />
                  {isSignUp && (
                    <>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </>
                  )}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setIsSignUp(!isSignUp)}
                    sx={{ mb: 2 }}
                  >
                    {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => navigate("/auth/forgot-password")}
                  >
                    Forgot Password?
                  </Button>
                </Box>
              </Box>
            </Slide>
            <Slide
              direction="left"
              in={showOrgSelection}
              mountOnEnter
              unmountOnExit
            >
              <Box>
                <OrganizationSelection
                  onClose={handleBackToAuth}
                  onSubmit={handleOrgSubmit}
                />
              </Box>
            </Slide>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Authentication;
