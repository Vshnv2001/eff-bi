import React, { useState } from "react";
import { submitNewPassword } from "supertokens-web-js/recipe/emailpassword";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };

    const newPasswordEntered = async () => {
        try {
            let response = await submitNewPassword({
                formFields: [{ id: "password", value: newPassword }]
            });

            if (response.status === "FIELD_ERROR") {
                response.formFields.forEach(formField => {
                    if (formField.id === "password") {
                        window.alert(formField.error);
                    }
                });
            } else if (response.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR") {
                window.alert("Password reset failed. Please try again.");
                window.location.assign("/auth");
            } else {
                window.alert("Password reset successful!");
                window.location.assign("/auth");
            }
        } catch (err: any) {
            if (err.isSuperTokensGeneralError === true) {
                window.alert(err.message);
            } else {
                window.alert("Oops! Something went wrong.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
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
            </div>
        </div>
    );
};

export default ResetPassword;