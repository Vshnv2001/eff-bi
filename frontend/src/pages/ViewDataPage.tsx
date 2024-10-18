import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody, Spinner,
} from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../config/index";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import DataTable from "../components/DataTable/DataTable";

interface Table {
  table_name: string;
  table_description?: string;
  column_headers: string[];
  rows: string[][];
}

interface TableWithDescriptionProps { table: Table; }
const TableWithDescription: React.FC<TableWithDescriptionProps> = ({ table }) => (
  <>
    <Typography className="text-xl font-bold">
      {table.table_name}
    </Typography>
    {table.table_description && (
      <Typography variant="paragraph" className="mb-4">
        {table.table_description}
      </Typography>
    )}
    <DataTable columns={table.column_headers.map((header: string) => ({ id: header, label: header }))}
               data={table.rows} />
  </>
);

export default function ViewDataPage() {
  const [data, setData] = useState([] );
  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_API_URL}/api/tables/${userId}`);
        //Example response:
        //     {
        //     "tables": [
        //         {
        //             "table_name": "rider_exits",
        //             "column_headers": ["rider,"stage","reason"],
        //             "rows": [[195, 1, "withdrawal"], [76, 4, "DNS"], [45, 8, "DNS"]],
        //             "table_description": ""
        //         },
        //         {
        //         "table_name": "locations",
        //         "column_headers": ["name", "country"],
        //         "rows": [["Agen", "FRA"], ["Alexandrie", "ITA"], ["Aoste", "FRA"]],
        //         "table_description": ""
        //         }
        //     ]}
        //     '''
        // console.log(response.data);
        setData(response.data?.tables);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  console.log(data);
  if (loading) {
    return <div className="fixed inset-0 flex items-center justify-center bg-gray-800 min-h-screen">
      <Spinner className="h-10 w-10"/>
    </div>;
  }

  if (data.length == 0) {
    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 p-10">
      <Card className="w-full max-w-4xl p-10 rounded-xl">
        <div className="text-lg text-center">
          You do not have access to any tables, request for permissions with
          your admin.
        </div>
      </Card>
    </div>
    );
  }

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-10">
        <Typography
            as="h2"
            color="white"
        className="mb-6 text-4xl font-bold text-center"
      >
        View Data
      </Typography>
        {data.map((table, index) => (
            <Card key={index} className="w-full max-w-4xl bg-white my-4 rounded-xl p-10 shadow-md">
            <CardHeader floated={false} shadow={false} className="bg-gray-100 rounded-none" >
              <></>
          </CardHeader>
          <CardBody className="overflow-auto p-0">
            <TableWithDescription table={table} />
          </CardBody>
        </Card>
      ))}
    </div>
  );
}