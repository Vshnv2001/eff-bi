import React, { useState } from "react";
import { sendPasswordResetEmail } from "supertokens-web-js/recipe/emailpassword";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const sendEmailClicked = async () => {
        try {
            let response = await sendPasswordResetEmail({
                formFields: [{ id: "email", value: email }]
            });

            if (response.status === "FIELD_ERROR") {
                response.formFields.forEach(formField => {
                    if (formField.id === "email") {
                        window.alert(formField.error);
                    }
                });
            } else if (response.status === "PASSWORD_RESET_NOT_ALLOWED") {
                window.alert("Password reset is not allowed for this account.");
            } else {
                window.alert("Please check your email for the password reset link.");
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
                <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email:</label>
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
            </div>
        </div>
    );
};

export default ForgotPassword;