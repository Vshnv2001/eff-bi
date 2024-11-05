import { useState, useEffect } from "react";
import { Typography, Button, Spinner, Dialog } from "@material-tailwind/react";
import DashboardForm from "../components/Dashboard/DashboardForm";
import axios from "axios";
import { DashboardProps } from "../components/Dashboard/DashboardProps";
import NotificationDialog from "../components/Dashboard/NotificationDialog";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import DashboardPage from "./DashboardPage";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, TextField, InputAdornment, Box } from "@mui/material";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
  colorSchemes: { light: true },
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});

export default function DashboardsPage() {
  //const [dashboardDescription, setDashboardDescription] = useState("");
  const [dashboards, setDashboards] = useState<DashboardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dbUri, setDbUri] = useState("");
  const [isDisabledField, setIsDisabledField] = useState(false);
  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;
  const navigate = useNavigate();
  const router = useDemoRouter("/1");

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
    { kind: "header" as const, title: "Dashboards" },
    ...dashboards.map((dashboard) => ({
      kind: "page" as const,
      segment: dashboard.dash_id,
      title: dashboard.title,
      icon: <DashboardIcon />,
    })),
    { kind: "divider" as const },
  ];

  function DashboardPageContent({ pathname }: { pathname: string }) {
    return <DashboardPage pathname={pathname} />;
  }

  function Search() {
    return (
      <Box px={2}>
        {" "}
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton type="button" aria-label="search" size="small">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>
    );
  }

  function SidebarFooter() {
    const [open, setOpen] = useState(false);
    const [dashboardName, setDashboardName] = useState("");
    const [dashboardDescription, setDashboardDescription] = useState("");

    const handleDashboardCreated = () => {
      fetchDashboards();
      setOpen(false);
    };

    const handleOpen = () => {
      setOpen(!open);
      setDashboardName("");
      setDashboardDescription("");
    };

    return (
      <div style={{ paddingBottom: "16px" }}>
        <div style={{ marginBottom: "16px" }}>
          <Search />
        </div>

        <Button
          variant="text"
          size="sm"
          className="text-black flex items-center h-[5vh] w-full gap-2 justify-start font-bold hover:bg-gray-300 hover:text-black z-10"
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
      </div>
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
        console.log(dbUri, isDisabledField);
      } else {
        console.error("Failed to fetch db settings:", response);
      }
    } catch (error) {
      console.error("Error fetching db settings:", error);
    }
  };

  const navigateToSettings = () => {
    navigate("/settings/database");
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={theme}>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner className="h-10 w-10" />
        </div>
      )}

      <DashboardLayout
        slots={{
          sidebarFooter: SidebarFooter,
        }}
        sx={{ height: "calc(100vh - 60px)" }}
      > 
        
        {dashboards.length > 0 || isLoading ? (
          
          <DashboardPageContent pathname={router.pathname} />
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Typography color="black" className="text-xl text-center italic">
              No dashboards found. Create one to get started.
            </Typography>
          </div>
        )}
      </DashboardLayout>

      <NotificationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        navigateToSettings={navigateToSettings}
      />
    </AppProvider>
  );
}
