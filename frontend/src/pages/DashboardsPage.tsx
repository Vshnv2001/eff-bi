import { useState, useEffect } from "react";
import { Typography, Button, Spinner, Dialog } from "@material-tailwind/react";
import DashboardForm from "../components/Dashboard/DashboardForm";
import DashboardCard from "../components/Dashboard/DashboardCard";
import axios from "axios";
import { DashboardProps } from "../components/Dashboard/DashboardProps";
import NotificationDialog from "../components/Dashboard/NotificationDialog";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import DashboardPage from "./DashboardPage";

const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
  colorSchemes: { light: true, dark: true },
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});

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
  const router = useDemoRouter("/dashboards");

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
      console.error("Failed to fetch dashboards");
    } finally {
      setIsLoading(false);
    }
  };

  const NAVIGATION = [
    { kind: "header", title: "Main items" },
    ...dashboards.map((dashboard) => ({
      segment: dashboard.dash_id,
      title: dashboard.title,
      icon: <DashboardIcon />,
    })),
    { kind: "divider" },
    { kind: "header", title: "Analytics" },
    { segment: "reports", title: "Reports", icon: <BarChartIcon /> },
    { segment: "integrations", title: "Integrations", icon: <LayersIcon /> },
  ];

  function DemoPageContent({ pathname }: { pathname: string }) {
    useEffect(() => {
      console.log("use effect");
      fetchTiles();
    }, []);
    
    const fetchTiles = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tiles/`,
          {
            params: { dash_id: parseInt(pathname.replace("/", ""), 10) },
          }
        );

        if (response.status === 200 && response.data && response.data.data) {
          console.log("success");
        }
      } catch {}
    };

    return (
      <Box
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography>Dashboard content for {pathname}</Typography>

        <Typography>
          Dashboard content for {parseInt(pathname.replace("/", ""), 10)}
        </Typography>
      </Box>
    );
  }

  const fetchDbSettings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/uri/${userId}`
      );
      if (response.status === 200) {
        setDbUri(response.data.database_uri);
        setIsDialogOpen(!response.data.database_uri);
        setIsDisabledField(!!response.data.database_uri);
      } else {
        console.error("Failed to fetch db settings:", response);
      }
    } catch (error) {
      console.error("Error fetching db settings:", error);
    }
  };

  const handleDashboardCreated = () => {
    fetchDashboards();
    setOpen(false);
  };

  const handleOpen = () => {
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
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

{
  /*
 <DashboardPage pathname={router.pathname} />
  <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
      <DashboardLayout>
        <Box
          className={`min-h-screen bg-gray-900 p-8 ${open ? "opacity-60" : ""}`}
        >
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Spinner className="h-10 w-10" />
            </div>
          )}

          <Breadcrumbs
            aria-label="breadcrumb"
            style={{ color: "white", fontSize: "16px" }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="/"
              style={{ color: "#fff" }}
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="text.primary"
              style={{ color: "#4995ec" }}
            >
              Dashboards
            </Link>
          </Breadcrumbs>

          <div className="flex items-center justify-between mb-8 relative mt-4">
            <div className="absolute inset-x-0 text-center">
              <Typography color="white" className="text-3xl font-bold">
                Dashboards
              </Typography>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <DashboardCard key={dashboard.dash_id} dashboard={dashboard} />
            ))}
            {!dashboards.length && !isLoading && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <Typography
                  color="white"
                  className="text-xl text-center italic"
                >
                  No dashboards found. Create one to get started.
                </Typography>
              </div>
            )}
          </div>

          <Dialog open={open} handler={handleOpen} size="md">
            <DashboardForm
              dashboardName={dashboardName}
              setDashboardName={setDashboardName}
              dashboardDescription={dashboardDescription}
              setDashboardDescription={setDashboardDescription}
              onDashboardCreated={handleDashboardCreated}
              onClose={() => setOpen(false)}
            />
          </Dialog>

          <NotificationDialog
            open={isDialogOpen}
            onClose={handleDialogClose}
            navigateToSettings={navigateToSettings}
          />
        </Box>
        <AppProvider
          navigation={NAVIGATION}
          router={router}
          theme={demoTheme}
        >
          <DashboardLayout>
            <DemoPageContent pathname={`/dashboards/${dashboard.dash_id}`} />
          </DashboardLayout>
        </AppProvider>
      </DashboardLayout>
    </AppProvider>
  
*/
}
