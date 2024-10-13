import { useEffect, useState } from "react";
import { useAuth } from "./AuthenticationContext";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useNavigate } from "react-router-dom";
import { BACKEND_API_URL } from "../../config";

const FetchUserData: React.FC = () => {
  const sessionContext = useSessionContext();
  const { setUserId, setEmail, setFirstName, setLastName, setOrganizationId } =
    useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (sessionContext.loading || !sessionContext.userId) {
        return;
      }

      const userId = sessionContext.userId;

      try {
        const response = await fetch(
          `${BACKEND_API_URL}/api/users/${userId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          console.log("User data fetched:", userData);

          setUserId(userId);
          setFirstName(userData.first_name);
          setLastName(userData.last_name);
          setEmail(userData.email);
          setOrganizationId(userData.organization_id);
          navigate("/");
        } else {
          console.error("Error fetching user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [
    sessionContext,
    setUserId,
    setEmail,
    setFirstName,
    setLastName,
    setOrganizationId,
    navigate,
  ]); // Update dependencies

  return isLoading ? <div>Loading user data...</div> : null;
};

export default FetchUserData;
