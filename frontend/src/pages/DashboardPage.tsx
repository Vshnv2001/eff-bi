import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Tile } from "../components/Dashboard/consts/Tile";
import { components } from "../components/Dashboard/consts/Components";

export default function DashboardPage() {
  const navigate = useNavigate(); 
  const { dashboardId } = useParams();

  const [dashboardData, setDashboardData] = useState<Tile[]>([]);

  useEffect(() => {
    fetchTiles();
  }, []);

  const fetchTiles = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tiles/`,
      {
        params: {
          dash_id: dashboardId,
        },
      }
    );
    console.log("dashboard data", response.data.data);
    setDashboardData(response.data.data);
  };


  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex justify-between items-center mb-8">
        <Typography variant="h2" color="blue-gray" className="text-4xl font-bold">
          Dashboard
      </Typography>
      <Button
        size="lg"
        color="blue"
        variant="filled"
        className="flex items-center gap-2 justify-center"
        onClick={() => {
          navigate(`/dashboards/${dashboardId}/tiles/new`);
        }}
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
        {dashboardData.map((tile) => {
          const component = components[tile.component as keyof typeof components].component;
          const props = components[tile.component as keyof typeof components].props;
          console.log("Component", component);
          console.log("props", props);
          if (!component || typeof component !== 'function') {
            console.error(`Invalid component for tile: ${tile.title}`);
            return null;
          }
          return (
            <Card key={tile.id} className="bg-gray-800 text-white">
              <CardBody>
                <Typography variant="h5" className="mb-2">
                  {tile.title}
                </Typography>
                <Typography className="text-gray-300">
                  {tile.description}
                </Typography>
                {component && React.createElement(component, {
                 props: props,
                })}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}