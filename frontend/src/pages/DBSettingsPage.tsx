import { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Radio,
  ThemeProvider,
  Button,
} from "@material-tailwind/react";
import axios from "axios";
import { useAuth } from "../components/Authentication/AuthenticationContext";
import { BACKEND_API_URL } from "../config/index";

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
  const [selectedDbUri, setSelectedDbUri] = useState("");
  const [dbUri, setDbUri] = useState("");
  const { userId, organizationId } = useAuth();

  const handleSave = async () => {
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
      const response = await axios.post(
        `${BACKEND_API_URL}/api/connection/`,
        reqBody
      );

      if (response.status === 201) {
        alert("Connection saved successfully!");
        setDbUri("");
      }
    } catch (error: any) {
      if ((error as any).response) {
        console.error("Backend error:", error.response.data);
        alert(
          `Error: ${
            error.response.data.message || "Failed to save connection."
          }`
        );
      } else if (error.request) {
        console.error("Network error:", error.request);
        alert("Network error: Failed to reach the server.");
      } else {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <ThemeProvider value={darkTheme}>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Typography
            as="h2"
            color="white"
            className="mb-6 text-3xl font-bold text-center"
          >
            Organization Settings
          </Typography>
          <Typography as="h3" color="white" className="mb-6 text-2xl font-bold">
            Select Database
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
                    name="database"
                    color="blue"
                    crossOrigin={undefined}
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
              type="text"
              placeholder="Database URI"
              className="w-full p-2 rounded bg-white text-black border border-gray-700 focus:outline-none focus:border-blue-500"
              value={dbUri}
              onChange={(e) => setDbUri(e.target.value)}
            />
          </div>
          <div className="flex justify-center mt-12">
            <Button color="blue" className="w-full" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
