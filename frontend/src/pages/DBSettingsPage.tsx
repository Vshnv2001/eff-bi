import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Radio,
  ThemeProvider,
  Button,
  Spinner,
} from "@material-tailwind/react";
import axios from "axios";
import { useAuth } from "../components/Authentication/AuthenticationContext";
import { BACKEND_API_URL } from "../config/index";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

const databases = [
  {
    id: "mysql",
    name: "MySQL",
    logo: "https://www.vectorlogo.zone/logos/mysql/mysql-ar21.svg",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    logo: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg",
  },
  {
    id: "sqlite",
    name: "SQLite",
    logo: "https://www.vectorlogo.zone/logos/sqlite/sqlite-ar21.svg",
  },
  {
    id: "oracle",
    name: "Oracle DB",
    logo: "https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg",
  },
];

const darkTheme = {
  card: {
    defaultProps: {
      color: "transparent",
      shadow: false,
      className: "border border-blue-gray-800",
    },
  },
};

export default function DBSettingsPage() {
  const [selectedDb, setSelectedDb] = useState("");
  const [dbUri, setDbUri] = useState("");
  const [isDisabledField, setIsDisabledField] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { organizationId } = useAuth();
  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;

  useEffect(() => {
    const fetchDbSettings = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/api/users/uri/${userId}`
        );
        if (response.status === 200) {
          setDbUri(response.data.database_uri);
          setIsDisabledField(true);
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
  }, []);

  const handleSave = async () => {
    if (isDisabledField) {
      return;
    }
    if (!dbUri) {
      // TODO do proper error handling in frontend
      alert("Error: Database URI is required.");
      return;
    }

    const reqBody = {
      uri: dbUri,
      user_id: userId,
      org_id: Number(organizationId),
      // TODO: hardcoded for now, change when application allows for different db
      // probably use selectedDb
      db_type: "postgres",
    };

    // console.log(reqBody);

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BACKEND_API_URL}/api/connection/`,
        reqBody
      );

      if (response.status === 201) {
        alert("Connection saved successfully!");
        setDbUri("");
      }
    } catch (error) {
      if ((error as any).response) {
        console.error("Backend error:", (error as any).response.data);
        alert(
          `Error: ${
            (error as any).response.data.message || "Failed to save connection."
          }`
        );
      } else if ((error as any).request) {
        console.error("Network error:", (error as any).request);
        alert("Network error: Failed to reach the server.");
      } else {
        console.error("Error:", (error as any).message);
        alert(`Error: ${(error as any).message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    // TODO call refresh api
    console.log("refreshed!");
  };

  return (
    <ThemeProvider value={darkTheme}>
      <div className="min-h-screen bg-gray-800 text-gray-100 p-8">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Spinner className="h-10 w-10" />
          </div>
        )}
        <div className="max-w-4xl mx-auto">
          <Typography
            as="h2"
            color="white"
            className="mb-6 text-3xl font-bold text-center"
          >
            Database Settings
          </Typography>
          <Typography as="h3" color="white" className="mb-6 text-2xl font-bold">
            Select Database Type
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {databases.map((db) => (
              <Card
                key={db.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedDb === db.id
                    ? "border-blue-500"
                    : "hover:border-blue-300"
                }`}
                onClick={() => setSelectedDb(db.id)}
              >
                <CardBody className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-2 rounded">
                      <img
                        src={db.logo}
                        alt={`${db.name} logo`}
                        className="w-24 h-12 object-contain"
                      />
                    </div>
                    <Typography color="white" className="font-medium">
                      {db.name}
                    </Typography>
                  </div>
                  <Radio
                    disabled={isDisabledField}
                    crossOrigin={undefined}
                    name="database"
                    color="blue"
                    checked={selectedDb === db.id}
                    onChange={() => setSelectedDb(db.id)}
                    className="checked:border-blue-500 checked:before:bg-blue-500"
                  />
                </CardBody>
              </Card>
            ))}
          </div>
          <div className="mt-10">
            <Typography
              as="h3"
              color="white"
              className="mb-2 text-xl font-bold"
            >
              Enter Database URI
            </Typography>
            <input
              disabled={isDisabledField}
              type="text"
              placeholder={dbUri}
              className={`w-full p-2 rounded ${
                isDisabledField ? "bg-gray-400" : "bg-white"
              } text-black border border-gray-700 focus:outline-none focus:border-blue-500`}
              value={dbUri}
              onChange={(e) => setDbUri(e.target.value)}
            />
          </div>
          <div className="flex justify-center mt-12">
            {isDisabledField ? (
              <Button color="blue" className={`w-full`} onClick={handleRefresh}>
                Refresh
              </Button>
            ) : (
              <Button color="blue" className={`w-full`} onClick={handleSave}>
                Save
              </Button>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
