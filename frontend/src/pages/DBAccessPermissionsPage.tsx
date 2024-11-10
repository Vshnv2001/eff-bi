import { useState, useEffect } from "react";
import {
  Spinner,
} from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../config/index";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { createTheme } from "@mui/material/styles";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import TablePermissionsPage from "./TablePermissionsPage";

type PermissionData = {
  index : number;
  table_name: string;
  table_id: number;
  permissions: string;
};

export default function DBAccessPermissionsPage() {
  const [allPermissions, setAllPermissions] = useState<
    PermissionData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useDemoRouter("/1");
  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;

  const NAVIGATION = [
    { kind: "header" as const, title: "Tables" },
    ...allPermissions.map(({ table_name, index }) => ({
      kind: "page" as const,
      segment: index.toString(),
      title: table_name.length > 30 ? table_name.slice(0, 29) + "..." : table_name,
      icon: <LayersIcon />
    })),
    { kind: "divider" as const },
  ];

  function DashboardPageContent({ pathname }: { pathname: string }) {
    // filter function to get Data based on pathname
    const index = parseInt(pathname.replace("/", ""), 10);
    const permission = allPermissions.find((permission) => permission.index === index);
    if (allPermissions.length === 0) {
      return <div>No permission found</div>;
    }
    if (!permission) {
      return (
        <TablePermissionsPage
          table_name={allPermissions[0].table_name}
          table_id={allPermissions[0].table_id}
          permissions={allPermissions[0].permissions}
        />
      );
    }
    return (
      <TablePermissionsPage
        table_name={permission.table_name}
        table_id={permission.table_id}
        permissions={permission.permissions}
      />
    );
  }

  useEffect(() => {
    if (sessionContext.loading) {
      setIsLoading(true);
    }

    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/api/user-access-permissions/${userId}`
        );
        // // console.log(response.data.data);
        const enumPermissions = response.data.data.map((permission: any, index: number) => ({
          ...permission,
          index: index + 1,
        }));
        setAllPermissions(enumPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const demoTheme = createTheme({
    cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
    colorSchemes: { light: true },
    breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 z-50">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <AppProvider navigation={NAVIGATION} theme={demoTheme} router={router}>
      <DashboardLayout
        sx={{ height: "calc(100vh - 60px)", overflow: "auto" }}
      >
        <div style={{ maxWidth: "calc(100vw - 320px)" }}>
          <DashboardPageContent pathname={router.pathname} />
        </div>
      </DashboardLayout>
    </AppProvider>
  );
}
