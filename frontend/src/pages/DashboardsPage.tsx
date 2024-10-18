import { useState, useEffect } from "react";
import { Typography, Button } from "@material-tailwind/react";
import DashboardForm from "../components/Dashboard/DashboardForm";
import DashboardCard from "../components/Dashboard/DashboardCard";
import axios from "axios";
import { DashboardProps } from "../components/Dashboard/DashboardProps";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

export default function DashboardsPage() {
  const [open, setOpen] = useState(false);
  const [dashboardName, setDashboardName] = useState("");
  const [dashboardDescription, setDashboardDescription] = useState("");

  const sessionContext = useSessionContext();

  console.log(sessionContext);

  const [dashboards, setDashboards] = useState<DashboardProps[]>([]);

  useEffect(() => {
    console.log("fetching dashboards");
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/dashboards/`
    );
    setDashboards(response.data.data);
  };

  console.log(dashboards);

  const handleOpen = () => {
    setOpen(!open);
    setDashboardName("");
    setDashboardDescription("");
  };

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute inset-x-0 text-center">
          <Typography color="white" className="text-3xl font-bold">
            Dashboards
          </Typography>
        </div>
        <div className="flex-1" />
        <Button
          variant="text"
          size="sm"
          color="white"
          className="font-bold bg-blue-500 hover:bg-blue-600 hover:text-white z-10"
          onClick={handleOpen}
        >
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
        {dashboards.map((dashboard) => (
          <DashboardCard key={dashboard.dash_id} dashboard={dashboard} />
        ))}
        {!dashboards.length && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Typography color="white" className="text-xl text-center italic">
              No dashboards found. Create one to get started.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
