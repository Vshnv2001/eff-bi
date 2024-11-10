import { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Radio,
  Button,
  Spinner,
  Tooltip,
} from "@material-tailwind/react";
import axios from "axios";
import { useAuth } from "../../components/Authentication/AuthenticationContext";
import { BACKEND_API_URL } from "../../config/index";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {Alert} from "@mui/material";

const databases = [
  {
    id: "postgresql",
    name: "PostgreSQL",
    logo: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg",
  },
  {
    id: "mysql",
    name: "MySQL",
    logo: "https://www.vectorlogo.zone/logos/mysql/mysql-ar21.svg",
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

export default function DBSettingsPage() {
  const [selectedDb, setSelectedDb] = useState("postgresql");
  const [dbUri, setDbUri] = useState("");
  const [isDisabledField, setIsDisabledField] = useState(false);
  const [isLoadingDB, setIsLoadingDB] = useState(false);
  const { organizationId } = useAuth();
  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;

  const handleCopyMockData = () => {
    navigator.clipboard.writeText(
      "postgres://view_user:testeffbi@pg-effbi-mock-justintanwk2001-6f2d.l.aivencloud.com:18828/defaultdb"
    );
    toast.success("Mock data URI successfully copied!");
  };

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

    // // console.log(reqBody);

    try {
      setIsLoadingDB(true);
      const response = await axios.post(
        `${BACKEND_API_URL}/api/connection/`,
        reqBody
      );

      if (response.status === 201) {
        setIsDisabledField(true);
        toast.success("Connection saved successfully!");
        window.location.reload(); // refresh page to reflect changes
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
      setIsLoadingDB(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-100 p-8">
      {isLoadingDB && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-80 z-50">
          <Spinner className="h-10 w-10" />
          <Typography color="black" className="ml-2 pt-2">
            Analyzing your database...
          </Typography>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <Typography
          as="h2"
          color="white"
          className="mb-6 text-4xl font-bold text-center text-black"
        >
          Database Settings
        </Typography>
        <Typography color="white" className="mt-1 font-normal text-center text-black">
          Connect your database to view your data in Eff BI. Enter your database URI below.
        </Typography>
        <Typography
          as="h3"
          color="white"
          className="mb-2 mt-12 text-2xl font-bold text-black"
        >
          Database Type
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {databases.map((db) => (
            <Card
              key={db.id}
              className={`cursor-pointer transition-all duration-300 border border-gray-400 ${
                selectedDb === db.id
                  ? "border-blue-500"
                  : "hover:border-blue-300"
              } ${db.id !== "postgresql" ? "opacity-50 bg-gray-100 cursor-not-allowed" : ""}`}
              onClick={() => db.id === "postgresql" && setSelectedDb(db.id)}
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
                  <Typography color="white" className="font-medium text-black">
                    {db.name}
                  </Typography>
                </div>
                <Radio
                  disabled={isDisabledField || db.id !== "postgresql"}
                  crossOrigin={undefined}
                  name="database"
                  color="blue"
                  checked={selectedDb === db.id}
                  onChange={() => db.id === "postgresql" && setSelectedDb(db.id)}
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
            className="mb-2 text-2xl font-bold text-black"
          >
            Database URI
          </Typography>
          <Alert severity="info" className="mt-2 mb-2">
           If you don't currently have a database URI, you may use our mock database URI:{" "}
            <Button
              variant="text"
              color="blue"
              className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 px-1 py-1"
              onClick={handleCopyMockData}
            >
              <ContentCopyIcon fontSize="small" />
              Mock Data
            </Button>
          </Alert>
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
        <div className="flex mt-12">
            <Tooltip
              content={
                  <div className="w-80">
                    <Typography
                      variant="small"
                      color="white"
                      className="font-medium opacity-80"
                    >
                      Eff BI operates with read-only permissions and will not modify your data.
                      Your connection is secure.
                    </Typography>
                  </div>
                }
                placement="top"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 },
                }}
              >
              <Button
                color="blue"
                className={`w-full text-md tracking-widest`}
                onClick={handleSave}
                disabled={isDisabledField}
              >
                Save
              </Button>
            </Tooltip>
          </div>
        )
      </div>
    </div>
  );
}
