import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Spinner,
} from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../../config/index";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import DataTable from "../../components/DataTable/DataTable";
import LayersIcon from "@mui/icons-material/Layers";
import {DashboardLayout} from "@toolpad/core/DashboardLayout";
import {AppProvider} from "@toolpad/core/AppProvider";
import {useDemoRouter} from "@toolpad/core/internal";
import {createTheme} from "@mui/material/styles";
import DashboardPage from "../DashboardPage.tsx";
import TablePage from "./TablePage.tsx";

interface Table {
  table_name: string;
  table_description?: string;
  column_headers: string[];
  rows: string[][];
}

interface TableWithDescriptionProps {
  table: Table;
}

const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
  colorSchemes: { light: true, dark: true },
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});

const TableWithDescription: React.FC<TableWithDescriptionProps> = ({
  table,
}) => (
  <>
    <Typography className="text-xl font-bold">{table.table_name}</Typography>
    {table.table_description && (
      <Typography variant="paragraph" className="mb-4">
        {table.table_description}
      </Typography>
    )}
    <DataTable
      columns={table.column_headers.map((header: string) => ({
        id: header,
        label: header,
      }))}
      data={table.rows}
    />
  </>
);

export default function ViewDataPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;
  const [loading, setLoading] = useState(false);
  const router = useDemoRouter("/view-data");

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

  function DashboardPageContent({ pathname }: { pathname: string }) {
    // filter function to get Data based on pathname
    pathname = pathname.replace("/", "");
    const table = tables.find((table) => table.table_name === pathname);
    return <TablePage table={table}/>
    // return <DashboardPage pathname={pathname} />;
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
        <Card className="w-full max-w-4xl p-10 rounded-xl">
          <div className="text-lg text-center text-black">
            You do not have access to any tables, request for permissions with
            your admin.
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
      <DashboardLayout
        slots={{
          // sidebarFooter: SidebarFooter,
        }}
        sx={{ height: "calc(100vh - 60px)" }}
      >
        <DashboardPageContent pathname={router.pathname} />
        </DashboardLayout>
    </AppProvider>
  );
};