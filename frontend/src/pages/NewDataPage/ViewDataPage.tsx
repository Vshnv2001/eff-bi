import { useState, useEffect } from "react";
import {Button, Card, Spinner, Tooltip} from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../../config/index";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import LayersIcon from "@mui/icons-material/Layers";
import {DashboardLayout} from "@toolpad/core/DashboardLayout";
import {AppProvider} from "@toolpad/core/AppProvider";
import {useDemoRouter} from "@toolpad/core/internal";
import {createTheme} from "@mui/material/styles";
import TablePage from "./TablePage.tsx";
import {toast} from "react-toastify";
import {useAuth} from "../../components/Authentication/AuthenticationContext.tsx";
import {Typography} from "@mui/material";

interface Table {
  table_name: string;
  table_description?: string;
  column_headers: string[];
  rows: string[][];
}


const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
  colorSchemes: { light: true },
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});


export default function ViewDataPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const sessionContext = useSessionContext();
  const { organizationId } = useAuth();
  const userId = sessionContext.loading ? null : sessionContext.userId;
  const [loading, setLoading] = useState(false);
  const router = useDemoRouter("/view-data");
  const [refreshLoading, setRefreshLoading] = useState(false);

  const NAVIGATION = [
    { kind: "header" as const, title: "Tables" },
    ...tables.map((table) => ({
      kind: "page" as const,
      segment: table.table_name,
      title: table.table_name,
      icon: <LayersIcon />,
    })),
    { kind: "divider" as const},
  ];
  const handleRefresh = async () => {
    const reqBody = {
      org_id: Number(organizationId),
      user_id: userId,
    };

    try {
      setRefreshLoading(true);
      // // console.log(organizationId);
      // // console.log(reqBody);
      // // console.log(userId);
      const response = await axios.post(
        `${BACKEND_API_URL}/api/connection/refresh/`,
        reqBody
      );

      if (response.status === 200) {
        toast.success("Database refreshed successfully!");
      }
    } catch (error) {
      if ((error as any).response) {
        console.error("Backend error:", (error as any).response.data);
      } else if ((error as any).request) {
        console.error("Network error:", (error as any).request);
      } else {
        console.error("Error:", (error as any).message);
      }
      toast.error("Failed to refresh data");
    } finally {
      setRefreshLoading(false);
    }
  };
  function SidebarFooter() {
    return (
      <div
        style={{
          padding: "10px",
          position: "sticky",
          bottom: 0,
          zIndex: 1,
          backgroundColor: "white",
        }}
      >
        <Tooltip
          content={
            <div className="w-80">
              <Typography
                variant="body2"
                color="white"
                className="font-medium opacity-80"
              >
                Refresh is used when you have updates in your original database
                and want Eff BI to update our snapshot of entire your data
              </Typography>
            </div>
          }
          placement="top"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
          className="z-[999990]"
        >
          <Button
            variant="filled"
            size="lg"
            onClick={handleRefresh}
            fullWidth={true}
            color="blue"
          >
            Refresh Data
          </Button>
        </Tooltip>
      </div>
    );
  }

  function DashboardPageContent({ pathname }: { pathname: string }) {
    // filter function to get Data based on pathname
    pathname = pathname.replace("/", "");
    const table = tables.find((table) => table.table_name === pathname);
    if (!table) {
      return <TablePage table={tables[0]}/>
    }
    return <TablePage table={table}/>
  }

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/api/connection/${userId}`
        );
        setTables(response.data?.tables);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 z-50">
        <Spinner className="h-10 w-10"/>
      </div>
    );
  }

  if (tables.length == 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg p-10">
        <Card className="w-full max-w-4xl p-10 rounded-xl" color="blue-gray">
          <div className="text-lg text-center text-black">
            You do not have access to any tables, request for permissions with
            your administrator.
          </div>
        </Card>
      </div>
    );
  }
  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
    >
      {refreshLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner className="h-10 w-10" />
        </div>
        )}

      <DashboardLayout
          slots={{
            sidebarFooter: SidebarFooter,
          }}
          sx={{height: "calc(100vh - 60px)", overflow:"auto"}}
      >
        <div style={{maxWidth: 'calc(100vw - 320px)'}}>
          <DashboardPageContent pathname={router.pathname}/>
        </div>

      </DashboardLayout>
    </AppProvider>
  );
};