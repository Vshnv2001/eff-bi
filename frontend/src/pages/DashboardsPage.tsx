import { useState, useEffect } from "react";
import {
  Typography,
  Button,
} from "@material-tailwind/react";
import DashboardForm from "../components/Dashboard/DashboardForm";
import Tile from "../components/Dashboard/Tile";
import axios from "axios";
import { Dashboard } from "../consts/Dashboard";

export default function DashboardsPage() {
  const [open, setOpen] = useState(false);
  const [dashboardName, setDashboardName] = useState("");
  const [dashboardDescription, setDashboardDescription] = useState("");

  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  useEffect(() => {
    console.log("fetching dashboards");
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboards/`);
    setDashboards(response.data.data);
  };

  console.log(dashboards);

  const handleOpen = () => {
    setOpen(!open);
    setDashboardName("");
    setDashboardDescription("");
  }

  return (
    <div className="min-h-screen bg-gray-800 p-8">
        <div className="flex items-center justify-between mb-8">
        <Typography color="white" className="text-3xl font-bold">
            Dashboards
        </Typography>
        <Button variant="text" size="sm" color="white" className="font-bold bg-blue-500 hover:bg-blue-600 hover:text-white" onClick={handleOpen}>
          Create Dashboard
        </Button>
    </div>
    <DashboardForm
        open={open}
        handleOpen={handleOpen}
        setOpen={setOpen}
        dashboardName={dashboardName}
        setDashboardName={setDashboardName}
        dashboardDescription={dashboardDescription}
        setDashboardDescription={setDashboardDescription}
    />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map((dashboard) => {
          return (
            <Tile key={dashboard.dash_id} dashboard={dashboard} />
          );
        })}
      </div>
    </div>
  );
}