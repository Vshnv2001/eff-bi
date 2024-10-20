// DashboardsPage.tsx
import { useState, useEffect } from "react";
import { Typography, Button } from "@material-tailwind/react";
import DashboardForm from "../components/Dashboard/DashboardForm";
import DashboardCard from "../components/Dashboard/DashboardCard";
import axios from "axios";
import { DashboardProps } from "../components/Dashboard/DashboardProps";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardsPage() {
  const [open, setOpen] = useState(false);
  const [dashboardName, setDashboardName] = useState("");
  const [dashboardDescription, setDashboardDescription] = useState("");
  const [dashboards, setDashboards] = useState<DashboardProps[]>([]);

  const sessionContext = useSessionContext();

  useEffect(() => {
    console.log("fetching dashboards");
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboards/`
      );
      setDashboards(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch dashboards");
    }
  };

  const handleDashboardCreated = (success: boolean, message: string) => {
    if (success) {
      toast.success(message);
      fetchDashboards();
    } else {
      toast.error(message);
    }
  };

  const handleOpen = () => {
    toast.dismiss();
    setOpen(!open);
    setDashboardName("");
    setDashboardDescription("");
  };

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
        className="z-[9999] !important"
      />

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
          className="flex items-center gap-2 justify-center font-bold bg-blue-500 hover:bg-blue-600 hover:text-white z-10"
          onClick={handleOpen}
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
        onDashboardCreated={handleDashboardCreated}
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
