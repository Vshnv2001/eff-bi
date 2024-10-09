import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import DashboardModal from "../components/DashboardModal/DashboardModal";
import { useAuth } from "../components/Authentication/AuthenticationContext";
import DashboardCard from "../components/DashboardModal/DashboardCard";
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

  const {
    firstName,
    lastName,
    organizationId,
  } = useAuth();

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
    <DashboardModal
        open={open}
        handleOpen={handleOpen}
        setOpen={setOpen}
        dashboardName={dashboardName}
        setDashboardName={setDashboardName}
        dashboardDescription={dashboardDescription}
        setDashboardDescription={setDashboardDescription}
        firstName={firstName}
        lastName={lastName}
        organizationId={organizationId}
    />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map((dashboard) => {
          return (
            <DashboardCard key={dashboard.dash_id} dashboard={dashboard} />
          );
        })}
      </div>
    </div>
  );
}