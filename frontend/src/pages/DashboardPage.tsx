import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { componentMapping } from "../components/Dashboard/ComponentMapping";
import { TileProps } from "../components/Dashboard/TileProps";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

  const handleOnDragEnd = (result: any) => {
    console.log(result);
  };

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
    <div className="min-h-screen bg-white p-8">
      <div className="flex justify-between items-center mb-8">
        <Typography
          variant="h2"
          color="blue-gray"
          className="text-4xl font-bold"
        >
          Dashboard
        </Typography>
        <Button
          size="lg"
          color="blue"
          className="flex items-center gap-2 justify-center"
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

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tiles" direction="horizontal">
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tilesData.map((tileData, index) => {
                const Component =
                  componentMapping[tileData.component as ComponentKeys] || null;

                if (!Component) {
                  console.error(
                    `Invalid component for tile: ${tileData.title}`
                  );
                  return null;
                }

                let componentProps = tileData.tile_props;
                if (typeof tileData.tile_props === "string") {
                  try {
                    componentProps = JSON.parse(tileData.tile_props);
                  } catch (error) {
                    console.error("Error parsing tile props", error);
                    return null;
                  }
                }

                return (
                  <Draggable
                    key={tileData.id}
                    draggableId={tileData.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        sx={{
                          backgroundColor: "#f9f9f9",
                          boxShadow: 3,
                          borderRadius: 2,
                          padding: 2,
                        }}
                      >
                        <CardContent sx={{ textAlign: "center" }}>
                          <Typography variant="h5" gutterBottom>
                            {tileData.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                          >
                            {tileData.description}
                          </Typography>
                          {Component && <Component {...componentProps} />}
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
