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
import { ToastContainer, toast } from "react-toastify";

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
      shadow: false,
      className: "border-4 border-blue-gray-800",
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
          if (response.data.database_uri !== "") {
            setIsDisabledField(true);
          }
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
      toast.warning(
        "We only allow 1 database URI per organization at the moment"
      );
      return;
    }
    if (!selectedDb) {
      toast.error("Database selection type is required!");
      return;
    }
    if (selectedDb !== "postgresql") {
      // TODO remove when other db are implemented
      toast.warning("We only support PostgreSQL at the moment");
      return;
    }
    if (!dbUri) {
      toast.error("Database URI is required!");
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
        setIsDisabledField(true);
        toast.success("Connection saved successfully!");
      }
    } catch (error) {
      if ((error as any).response) {
        console.error("Backend error:", (error as any).response.data);
      } else if ((error as any).request) {
        console.error("Network error:", (error as any).request);
      } else {
        console.error("Error:", (error as any).message);
      }
      toast.error("Failed to save connection");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!dbUri) {
      toast.error("Database URI is required!");
      return;
    }
    // TODO do finalize after refresh api implemented
    console.log("refresh!");

    // try {
    //   setIsLoading(true);
    //   const response = await axios.post(
    //     `${BACKEND_API_URL}/api/connection/refresh`
    //   );

    //   if (response.status === 200) {
    //     toast.success("Database refreshed successfully!");
    //   }
    // } catch (error) {
    //   if ((error as any).response) {
    //     console.error("Backend error:", (error as any).response.data);
    //   } else if ((error as any).request) {
    //     console.error("Network error:", (error as any).request);
    //   } else {
    //     console.error("Error:", (error as any).message);
    //   }
    //   toast.error("Failed to refresh data");
    // } finally {
    //   setIsLoading(false);
    // }
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
            className="mb-6 text-4xl font-bold text-center"
          >
            Database Settings
          </Typography>
          <Typography
            as="h3"
            color="white"
            className="mb-2 mt-12 text-2xl font-bold"
          >
            Database Type
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
              className="mb-2 text-2xl font-bold"
            >
              Database URI
            </Typography>
            <input
              disabled={isDisabledField}
              type="text"
              placeholder={"postgres://user@localhost/db"}
              className={`w-full p-2 rounded ${
                isDisabledField ? "bg-gray-400" : "bg-white"
              } text-black border border-gray-700 focus:outline-none focus:border-blue-500 focus:border-2`}
              value={dbUri}
              onChange={(e) => setDbUri(e.target.value)}
            />
          </div>
          {isDisabledField ? (
            <>
              <Typography
                as="h3"
                color="white"
                className="mb-2 pt-10 text-2xl font-bold"
              >
                Refresh Data
              </Typography>
              <div className="flex">
                <Button
                  color="blue"
                  className={`w-full text-md tracking-widest`}
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>
              </div>
            </>
          ) : (
            <div className="flex mt-12">
              <Button
                color="blue"
                className={`w-full text-md tracking-widest`}
                onClick={handleSave}
                disabled={isDisabledField}
              >
                Save
              </Button>
            </div>
          )}
          {/* </div> */}
        </div>
      </div>
      <ToastContainer
        className="pt-14"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
    </ThemeProvider>
  );
}
