import React, { useState } from "react";
import { sendPasswordResetEmail } from "supertokens-web-js/recipe/emailpassword";
import { Link } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const sendEmailClicked = async () => {
    setLoading(true);
    try {
      let response = await sendPasswordResetEmail({
        formFields: [{ id: "email", value: email }],
      });

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            setErrorMessage(formField.error);
          }
        });
      } else if (response.status === "PASSWORD_RESET_NOT_ALLOWED") {
        setErrorMessage("Password reset is not allowed for this account.");
      } else {
        setSuccessMessage(
          "If an account with this email exists, we've sent instructions to reset your password. Please check your inbox and spam folder."
        );
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Oops! Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-r from-red-100 to-blue-400 min-h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner className="h-10 w-10" />
        </div>
      )}

      {/* Left Image Section */}
      <div className="w-5/12 flex items-center justify-center relative">
        <div className="absolute top-8 left-5">
          <Link to="/">
            <img
              src="/assets/logo-nobg.png"
              alt="EFF BI Logo"
              style={{ width: "128px" }}
            />
          </Link>
        </div>
        <img
          src="/assets/signup-pic.png"
          alt="Forgot Password Visual"
          className="h-[25rem] w-auto"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-7/12 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Forgot Password
          </h2>

          {errorMessage && (
            <div className="mb-4 p-2 text-red-700">{errorMessage}</div>
          )}
          {successMessage && !loading && (
            <div className="mb-4 p-2 text-blue-900">{successMessage}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={sendEmailClicked}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Send Password Reset Email
          </button>

          {!loading && (
            <div className="mt-4 text-center">
              <Link to="/auth" className="text-blue-600 hover:underline">
                Back to Login/Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
