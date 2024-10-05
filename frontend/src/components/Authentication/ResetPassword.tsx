import React, { useState } from "react";
import { submitNewPassword } from "supertokens-web-js/recipe/emailpassword";
import { Link } from "react-router-dom"; // Make sure you have react-router-dom installed

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        setErrorMessage(""); // Clear error on change
        setSuccessMessage(""); // Clear success message on change
    };

    const newPasswordEntered = async () => {
        setLoading(true); // Set loading to true
        try {
            let response = await submitNewPassword({
                formFields: [{ id: "password", value: newPassword }]
            });

            if (response.status === "FIELD_ERROR") {
                response.formFields.forEach(formField => {
                    if (formField.id === "password") {
                        setErrorMessage(formField.error);
                    }
                });
            } else if (response.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR") {
                setErrorMessage("Password reset failed. Please try again.");
            } else {
                setSuccessMessage("Password reset successful!");
                // Redirect after a short delay to show the success message
                setTimeout(() => {
                    window.location.assign("/auth");
                }, 2000); // 2 seconds delay
            }
        } catch (err: any) {
            if (err.isSuperTokensGeneralError === true) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage("Oops! Something went wrong.");
            }
        } finally {
            setLoading(false); // Always set loading to false in the finally block
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                
                {errorMessage && (
                    <div className="mb-4 p-2 text-red-700">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 p-2 text-green-700">
                        {successMessage}
                    </div>
                )}
                {loading && (
                    <div className="mb-4 p-2 text-blue-700">
                        Loading...
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={newPasswordEntered}
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Set New Password
                </button>

                {/* Back to Login/Signup Link */}
                {!loading && (
                    <div className="mt-4 text-center">
                        <Link to="/auth" className="text-blue-600 hover:underline">
                            Back to Login/Signup
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;