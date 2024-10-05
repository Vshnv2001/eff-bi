import { useState } from "react";
import { signUp, signIn, doesEmailExist } from "supertokens-web-js/recipe/emailpassword";

const CustomUiList = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(true);

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
                window.location.href = "/homepage";
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
                window.location.href = "/homepage";
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
        <div style={{ maxWidth: "400px", margin: "auto" }}>
            <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={handleEmailChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange} required />
                </div>
                <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
                <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default CustomUiList;