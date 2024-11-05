import React, { useState, useEffect } from "react";
import { useAuth } from "../../components/Authentication/AuthenticationContext";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import axios from "axios";
import { BACKEND_API_URL } from "../../config/index";
import DBSettingsPage from "./DBSettingsPage";
import ViewDataPage from "./ViewDataPage";
import { Spinner } from "@material-tailwind/react";

export default function DataPage() {
  const [dbUri, setDbUri] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { organizationId } = useAuth();
  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;


  // Get the initial URI for the user's organisation,, if any
  useEffect(() => {
    const fetchDbSettings = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/api/users/uri/${userId}`
        );
        if (response.status === 200) {
          setDbUri(response.data.database_uri);
        } else {
          console.error("Failed to fetch db settings:", response);
        }
      } catch (error) {
        console.error("Error fetching db settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDbSettings();
  }, [userId, dbUri]);

  if (isLoading) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-300 z-50">
          <Spinner className="h-10 w-10"/>
        </div>
    );
  }

  // If the user has not set up a database URI, show the DBSettingsPage
  // If the user has set up a database URI, show the ViewDataPage
  if (!dbUri) {
    return (
      <DBSettingsPage
        setDbUri={setDbUri}
        userId={userId}
        organizationId={organizationId}
      />
    );
  } else {
    return <ViewDataPage />;
  }
}
