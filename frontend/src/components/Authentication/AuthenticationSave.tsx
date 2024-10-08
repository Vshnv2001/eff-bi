import { useEffect, useState } from "react";
import { useAuth } from "../Authentication/AuthenticationContext";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useNavigate } from "react-router-dom";

const AuthenticationSave: React.FC = () => {
  const sessionContext = useSessionContext();
  const { email, firstName, lastName, organizationId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saveUserToBackend = async () => {
      // Prevent execution if the user is already saved or if loading is in progress
      if (isSaved || sessionContext.loading || !sessionContext.userId) {
        return;
      }

      const userId = sessionContext.userId;

      const formData = {
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        organization: organizationId,
      };

      try {
        const createResponse = await fetch("http://localhost:8000/api/users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (createResponse.ok) {
          const createData = await createResponse.json();
          console.log("User created:", createData);
          setIsSaved(true);
          navigate("/");
        }
      } catch (error) {
        console.error("Error creating user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    saveUserToBackend();
  }, [sessionContext, email, firstName, lastName, organizationId, navigate, isSaved]);

  return isLoading ? <div>Loading...</div> : null; // Optional loading indicator
};

export default AuthenticationSave;