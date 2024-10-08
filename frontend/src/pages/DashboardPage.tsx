import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate(); 
  const { dashboardId } = useParams();

  const [dashboards, setDashboards] = useState([]);


  return (
    <div className="min-h-screen bg-white p-8">
      <Typography variant="h2" color="blue-gray" className="mb-8 text-4xl font-bold">
        Dashboard
      </Typography>
      <Button
        size="lg"
        color="blue"
        variant="filled"
        className="flex items-center gap-2 justify-center w-full mb-4"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {[...Array(5)].map((_, index) => (
          <Card key={index} className="bg-gray-800 text-white">
            <CardBody>
              <Typography variant="h5" className="mb-2">
                Tile {index + 1}
              </Typography>
              <Typography className="text-gray-300">
                This is a placeholder tile. Replace with actual content.
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}