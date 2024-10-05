import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, doesEmailExist } from "supertokens-web-js/recipe/emailpassword";

const CustomUiList = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(true);
    const navigate = useNavigate();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const signUpClicked = async () => {
        try {
            let response = await signUp({
                formFields: [{ id: "email", value: email }, { id: "password", value: password }]
            });

            if (response.status === "FIELD_ERROR") {
                response.formFields.forEach(formField => {
                    window.alert(formField.error);
                });
            } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
                window.alert(response.reason);
            } else {
                navigate("/homepage");
            }
        } catch (err) {
            window.alert("Oops! Something went wrong.");
        }
    };

    const signInClicked = async () => {
        try {
            let response = await signIn({
                formFields: [{ id: "email", value: email }, { id: "password", value: password }]
            });

            if (response.status === "FIELD_ERROR") {
                response.formFields.forEach(formField => {
                    window.alert(formField.error);
                });
            } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
                window.alert("Email password combination is incorrect.");
            } else {
                navigate("/homepage");
            }
        } catch (err) {
            window.alert("Oops! Something went wrong.");
        }
    };

    const checkEmail = async () => {
        try {
            let response = await doesEmailExist({ email });
            if (response.doesExist) {
                window.alert("Email already exists. Please sign in instead.");
            }
        } catch (err) {
            window.alert("Oops! Something went wrong.");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSignUp) {
            await checkEmail();
            await signUpClicked();
        } else {
            await signInClicked();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">{isSignUp ? "Sign Up" : "Sign In"}</h2>
                <form onSubmit={handleSubmit}>
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
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
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
                        onClick={() => navigate("/forgot-password")}
                        className="text-blue-500 hover:underline"
                    >
                        Forgot Password?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomUiList;