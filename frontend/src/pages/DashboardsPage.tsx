import { useState, useEffect } from "react";
import { Typography, Button, Spinner } from "@material-tailwind/react";
import DashboardForm from "../components/Dashboard/DashboardForm";
import DashboardCard from "../components/Dashboard/DashboardCard";
import axios from "axios";
import { DashboardProps } from "../components/Dashboard/DashboardProps";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationDialog from "../components/Dashboard/NotificationDialog";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

export default function DashboardsPage() {
  const [open, setOpen] = useState(false);
  const [dashboardName, setDashboardName] = useState("");
  const [dashboardDescription, setDashboardDescription] = useState("");
  const [dashboards, setDashboards] = useState<DashboardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dbUri, setDbUri] = useState("");
  const [isDisabledField, setIsDisabledField] = useState(false);
  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboards();
    fetchDbSettings();
  }, []);

  const fetchDashboards = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboards/`
      );
      setDashboards(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch dashboards");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDbSettings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/uri/${userId}`
      );
      if (response.status === 200) {
        setDbUri(response.data.database_uri);
        if (response.data.database_uri === "") {
          setIsDialogOpen(true);
        } else {
          setIsDisabledField(true);
        }
      } else {
        console.error("Failed to fetch db settings:", response);
      }
    } catch (error) {
      console.error("Error fetching db settings:", error);
    } finally {
      setIsLoading(false);
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
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const navigateToSettings = () => {
    navigate("/settings/database");
  };

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner className="h-10 w-10" />
        </div>
      )}
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
      />

      <div className="flex items-center justify-between mb-8 relative mt-4">
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
              {!isLoading
                ? "No dashboards found. Create one to get started."
                : ""}
            </Typography>
          </div>
        )}
      </div>
      <NotificationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        navigateToSettings={navigateToSettings}
      />
    </div>
  );
}
