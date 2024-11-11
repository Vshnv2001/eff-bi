import { useState, useEffect } from "react";
import { Button, Spinner, Tooltip } from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../../config/index";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import LayersIcon from "@mui/icons-material/Layers";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useDemoRouter } from "@toolpad/core/internal";
import { createTheme } from "@mui/material/styles";
import TablePage from "./TablePage.tsx";
import { toast } from "react-toastify";
import { useAuth } from "../../components/Authentication/AuthenticationContext.tsx";
import { Typography } from "@mui/material";
import LockPersonTwoToneIcon from "@mui/icons-material/LockPersonTwoTone";

interface Table {
  index: number;
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
  const router = useDemoRouter("/1");
  const [refreshLoading, setRefreshLoading] = useState(false);

  //console.log(router.pathname);

  const NAVIGATION = [
    { kind: "header" as const, title: "Tables" },
    ...tables.map((table) => ({
      kind: "page" as const,
      segment: table.index.toString(),
      title:
        table.table_name.length > 30
          ? table.table_name.slice(0, 29) + "..."
          : table.table_name,
      icon: <LayersIcon />,
    })),
    { kind: "divider" as const },
  ];

  const handleRefresh = async () => {
    const reqBody = {
      org_id: Number(organizationId),
      user_id: userId,
    };

    try {
      setRefreshLoading(true);
      // console.log(organizationId);
      // console.log(reqBody);
      // console.log(userId);
      const response = await axios.post(
        `${BACKEND_API_URL}/api/connection/refresh/`,
        reqBody
      );

      if (response.status === 200) {
        fetchData();
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
    const index = parseInt(pathname.replace("/", ""), 10);
    const table = tables.find((table) => table.index === index);
    return <TablePage table={table as Table} />;
  }

  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_API_URL}/api/connection/${userId}`
      );
      const enumTables = response.data?.tables.map((table: any, index: number) => ({
        ...table,
        index: index + 1
      }));
      setTables(enumTables);

      console.log("tables", tables)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-300 bg-opacity-50 z-50">
        <Spinner className="h-10 w-10" />
        <div className="text-xl text-center text-black pt-3">
          Loading your data...
        </div>
      </div>
    );
  }

  if (tables.length == 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg p-100 space-y-5">
        <div className="text-center">
          <LockPersonTwoToneIcon style={{ fontSize: "10rem" }} />
        </div>
        <div className="text-xl text-center text-black">
          You do not have access to any tables, request for permissions with
          your administrator.
        </div>
      </div>
    );
  }
  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
      {refreshLoading && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-80 z-[999990]">
            <Spinner className="h-10 w-10"/>
            <div className="text-xl text-center text-black pt-3">
              Refreshing your data...
            </div>
          </div>
      )}

      <DashboardLayout
          slots={{
            sidebarFooter: SidebarFooter,
          }}
        sx={{ height: "calc(100vh - 60px)", overflow: "auto" }}
      >
        <div style={{ maxWidth: "calc(100vw - 320px)" }}>
          <DashboardPageContent pathname={router.pathname} />
        </div>
      </DashboardLayout>
    </AppProvider>
  );
}
