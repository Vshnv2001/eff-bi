import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Dialog,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { componentMapping } from "../components/Dashboard/ComponentMapping";
import { TileProps } from "../components/Dashboard/TileProps";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NewTile from "../components/Dashboard/NewTile";

type ComponentKeys = keyof typeof componentMapping;

export default function DashboardPage() {
  const { dashboardId } = useParams();

  const [tilesData, setTilesData] = useState<TileProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardName, setDashboardName] = useState<string>("");
  const [isNewTileDialogOpen, setIsNewTileDialogOpen] = useState(false);

  useEffect(() => {
    fetchTiles();
    fetchDashboardName();
  }, []);

  const fetchDashboardName = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-name/`,
        {
          params: { dash_id: dashboardId },
        }
      );
      setDashboardName(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard name:", error);
    }
  };

  const fetchTiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tiles/`,
        {
          params: { dash_id: dashboardId },
        }
      );

      console.log("Response: ", response);

      if (response.status === 200 && response.data && response.data.data) {
        setTilesData(response.data.data);
      } else {
        console.log("Error: ", response);
      }
    } catch (error) {
      console.log("Error: ", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          console.error("Question is not relevant to the database");
        } else {
          console.error("Error fetching tiles");
        }
      } else {
        console.error("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewTileClick = () => {
    setIsNewTileDialogOpen(true);
  };

  const handleNewTileClose = () => {
    setIsNewTileDialogOpen(false);
    fetchTiles();
  };

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner className="h-10 w-10" />
        </div>
      )}
      <Breadcrumbs
        aria-label="breadcrumb"
        style={{ color: "white", fontSize: "16px" }}
      >
        <Link
          underline="hover"
          color="inherit"
          href="/"
          style={{ color: "#fff" }}
        >
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/dashboards"
          style={{ color: "#fff" }}
        >
          Dashboards
        </Link>
        <Link
          underline="hover"
          color="text.primary"
          style={{ color: "#4995ec" }}
        >
          {dashboardName}
        </Link>
      </Breadcrumbs>

      <div className="flex items-center justify-between mb-8 relative mt-4">
        <div className="absolute inset-x-0 text-center">
          <Typography color="white" className="text-3xl font-bold">
            {dashboardName}
          </Typography>
        </div>
        <div className="flex-1" />

        <Button
          variant="text"
          size="sm"
          color="white"
          className="flex items-center gap-2 justify-center font-bold bg-blue-500 hover:bg-blue-600 hover:text-white z-10"
          onClick={handleNewTileClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Create Tile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {tilesData.map((tileData) => {
          const Component =
            componentMapping[tileData.component as ComponentKeys] || null;

          if (!Component) {
            console.error(`Invalid component for tile: ${tileData.title}`);
            return null;
          }

          let componentProps = tileData.tile_props;
          if (typeof tileData.tile_props === "string") {
            try {
              componentProps = JSON.parse(tileData.tile_props);
              console.log("component prop", componentProps);
            } catch (error) {
              console.error("Error parsing tile props", error);
              return null;
            }
          }

          return (
            <Card
              key={tileData.id}
              className="text-black p-4 rounded-lg overflow-visible"
            >
              <CardBody className="flex flex-col items-center w-full">
                <div className="w-full">
                  {Component && (
                    <Component
                      {...componentProps}
                      title={tileData.title}
                      description={tileData.description}
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={isNewTileDialogOpen}
        handler={() => setIsNewTileDialogOpen(false)}
        size="md"
      >
        <NewTile onClose={handleNewTileClose} />
      </Dialog>
    </div>
  );
}
