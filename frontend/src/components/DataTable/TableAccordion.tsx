import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import axios from "axios";
import DataTable from "./DataTable";
import { BACKEND_API_URL } from "../../config";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

interface Table {
  table_name: string;
  table_description?: string;
  column_headers: string[];
  rows: string[][];
}

const TableAccordion: React.FC = () => {
  const [data, setData] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<number | null>(null);
  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;

  const handleOpen = (value: number) => {
    setOpen(open === value ? null : value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_API_URL}/api/connection/${userId}`);
        setData(response.data?.tables || []);
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
      <div className="flex items-center justify-center h-full">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No tables available. Please request permissions from your admin.
      </div>
    );
  }

  return (
    <div className="h-[500px] overflow-y-auto pr-2">
      {data.map((table, index) => (
        <Accordion
          key={index}
          open={open === index}
          className="mb-2 rounded-lg border border-blue-gray-100 px-4"
        >
          <AccordionHeader
            onClick={() => handleOpen(index)}
            className="transition-colors hover:bg-blue-gray-50/50 p-4"
          >
            <Typography variant="h6" className="text-sm">
              {table.table_name}
            </Typography>
          </AccordionHeader>
          <AccordionBody className="pt-0">
            {table.table_description && (
              <Typography variant="small" className="text-gray-600 mb-4">
                {table.table_description}
              </Typography>
            )}
            <div className="max-h-[300px] overflow-auto">
              <DataTable
                columns={table.column_headers.map((header: string) => ({
                  id: header,
                  label: header,
                }))}
                data={table.rows}
              />
            </div>
          </AccordionBody>
        </Accordion>
      ))}
    </div>
  );
};

export default TableAccordion;