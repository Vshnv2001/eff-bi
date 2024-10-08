import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signUp,
  signIn,
  doesEmailExist,
} from "supertokens-web-js/recipe/emailpassword";
import { useAuth } from "./AuthenticationContext";

const Authentication = () => {
  const {
    email,
    setEmail,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    organizationId,
    setOrganizationId,
  } = useAuth();

  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputError, setInputError] = useState({
    email: false,
    password: false,
  });
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const organizationIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizationId(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

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
        navigate("/auth/save");
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-custom justify-center items-center">
      {/* Header Section */}
      <div className="flex flex-col items-center">
        <img src="/assets/logo-nobg.png" alt="EFF BI Logo" className="w-32" />
      </div>

      {/* Form Box */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>

        {errorMessage && (
          <div className="mb-4 p-2 text-red-700 max-w-full w-full">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none ${
                inputError.email ? "animate-shake border-red-500" : ""
              }`}
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none ${
                inputError.password ? "animate-shake border-red-500" : ""
              }`}
            />
          </div>

          {/* Additional Fields for Sign Up */}
          {isSignUp && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  First Name:
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name:
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={handleLastNameChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Organization ID:
                </label>
                <input
                  type="text"
                  value={organizationId}
                  onChange={organizationIdChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-4 py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-200"
          >
            {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/auth/forgot-password")}
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
