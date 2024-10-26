import { useEffect, useState } from "react";
import { useAuth } from "./AuthenticationContext";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useNavigate, useLocation } from "react-router-dom";
import { BACKEND_API_URL } from "../../config";

const SaveUserData: React.FC = () => {
  const sessionContext = useSessionContext();
  const { email, firstName, lastName, organizationId, setUserId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const saveUserToBackend = async () => {
      if (isSaved || sessionContext.loading || !sessionContext.userId) {
        return;
      }

      const userId = sessionContext.userId;

      const formData = {
        id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        organization: organizationId,
        is_super_admin: location.state.isSuperAdmin,
      };

      console.log("form data", formData);

      try {
        const createResponse = await fetch(`${BACKEND_API_URL}/api/users/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (createResponse.ok) {
          const createData = await createResponse.json();
          console.log("User created:", createData);

          setUserId(userId);
          setIsSaved(true);
          navigate("/faq");
        }
      } catch (error) {
        console.error("Error creating user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    saveUserToBackend();
  }, [
    sessionContext,
    email,
    firstName,
    lastName,
    organizationId,
    navigate,
    isSaved,
    setUserId,
  ]);

  return isLoading ? <div>Loading...</div> : null;
};

export default SaveUserData;
