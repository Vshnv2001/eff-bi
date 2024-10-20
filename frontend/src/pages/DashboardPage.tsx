import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Dialog,
  Button,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { componentMapping } from "../components/Dashboard/ComponentMapping";
import { TileProps } from "../components/Dashboard/TileProps";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

  console.log("dashboardName: ", dashboardName);

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

      if (response.data && response.data.data) {
        setTilesData(response.data.data);
      } else {
        setError("No data found");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("Error fetching tiles");
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(tilesData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTilesData(items);
  };

  const handleNewTileClick = () => {
    setIsNewTileDialogOpen(true);
  };

  const handleNewTileClose = () => {
    setIsNewTileDialogOpen(false);
    fetchTiles();
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

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tiles">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card className="text-black">
                          <CardBody className="flex flex-col items-center">
                            <Typography
                              variant="h5"
                              className="text-black mb-2 text-center"
                            >
                              {tileData.title}
                            </Typography>
                            <Typography className="text-gray-800 text-center mb-4">
                              {tileData.description}
                            </Typography>
                            <div className="w-full">
                              {Component && <Component {...componentProps} />}
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog
        open={isNewTileDialogOpen}
        handler={() => setIsNewTileDialogOpen(false)}
        size="xl"
      >
        <NewTile onClose={handleNewTileClose} />
      </Dialog>
    </div>
  );
}

/*
  const fetchTiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const mockTilesData: TileProps[] = [
        {
          id: 1,
          dash_id: 101,
          title: "Sales Trends",
          description: "Monthly sales trends for desktop products.",
          component: "LineChartTemplate",
          tile_props: {
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
            height: 400,
          },
        },
        // You can add more mock tiles here following the same structure
      ];

      setTilesData(mockTilesData);
    } catch (error) {
      console.error("Error setting mock data:", error);
      setError("Error setting mock data");
    } finally {
      setLoading(false);
    }
  };
  */
