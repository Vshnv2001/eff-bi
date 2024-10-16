import { useEffect, useState } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { componentMapping } from "../components/Dashboard/ComponentMapping";
import { TileProps } from "../components/Dashboard/TileProps";

type ComponentKeys = keyof typeof componentMapping;

export default function DashboardPage() {
  console.log("component mounted");
  const navigate = useNavigate();
  const { dashboardId } = useParams();

  const [tilesData, setTilesData] = useState<TileProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("use effect");
    fetchTiles();
  }, []);

  const fetchTiles = async () => {
    console.log("fetchTiles called");
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching tiles");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tiles/`,
        {
          params: { dash_id: dashboardId },
        }
      );

      console.log("Full response:", response);

      if (response.data) {
        console.log("Tiles data", response.data.data);
        setTilesData(response.data.data || []);

        const tilesData: TileProps[] = [
          {
            id: 1, // Unique ID for each tile
            dash_id: 101, // ID of the dashboard this tile belongs to
            title: "Sales Trends", // Title of the chart
            description: "Monthly sales trends for desktop products.", // A brief description
            component: "LineChartTemplate", // The component name to render
            tile_props: {
              // Series and categories are part of the tile_props
              series: [
                {
                  name: "Desktops",
                  data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
                },
              ],
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
              ],
              height: 400, // Optional height field
            },
          },
          // Additional tile data objects can follow this structure
        ];

        // Set tilesData in state
        setTilesData(tilesData);
      } else {
        console.error("No data found in response");
        setError("No data found");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error:",
          error.response ? error.response.data : error.message
        );
        setError("Error fetching tiles");
      } else {
        console.error("Unexpected error:", error);
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute inset-x-0 text-center">
          <Typography color="white" className="text-3xl font-bold">
            Dashboard
          </Typography>
        </div>
        <div className="flex-1" />

        <Button
          variant="text"
          size="sm"
          color="white"
          className="flex items-center gap-2 justify-center font-bold bg-blue-500 hover:bg-blue-600 hover:text-white z-10"
          onClick={() => navigate(`/dashboards/${dashboardId}/tiles/new`)}
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
          Create New Tile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tilesData.map((tileData) => {
          console.log("tile data component", tileData.component);
          const Component =
            componentMapping[tileData.component as ComponentKeys] || null;

          if (!Component) {
            console.error(`Invalid component for tile: ${tileData.title}`);
            return null;
          }

          let componentProps = tileData.tile_props;
          console.log("component props", componentProps);
          if (typeof tileData.tile_props === "string") {
            try {
              componentProps = JSON.parse(tileData.tile_props);
            } catch (error) {
              console.error("Error parsing tile props", error);
              return null;
            }
          }

          return (
            <Card key={tileData.id} className="text-white">
              <CardBody>
                <Typography variant="h5" className="mb-2">
                  {tileData.title}
                </Typography>
                <Typography className="text-gray-300">
                  {tileData.description}
                </Typography>
                {Component && <Component {...componentProps} />}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
