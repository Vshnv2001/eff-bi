import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../../config";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import LayersIcon from "@mui/icons-material/Layers";

interface Table {
  table_name: string;
  table_description?: string;
  column_headers: string[];
  rows: string[][];
}

const ColumnAccordion: React.FC = () => {
  const [data, setData] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);
  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;

  const handleOpen = (value: number) => {
    setOpenAccordions((prev) =>
      prev.includes(value)
        ? prev.filter((index) => index !== value)
        : [...prev, value]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/api/connection/${userId}`
        );
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
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <Spinner className="h-10 w-10" />
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
    <div className="h-auto overflow-y-auto">
      {data.map((table, tableIndex) => (
        <Accordion
          key={tableIndex}
          open={openAccordions.includes(tableIndex)}
          className="mb-2"
        >
          <AccordionHeader
            onClick={() => handleOpen(tableIndex)}
            className={`flex items-center justify-between w-full p-4 cursor-pointer rounded-lg transition-colors duration-200 ${
              openAccordions.includes(tableIndex)
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-blue-50"
            } border-b-0 no-underline`}
          >
            <div className="flex items-center overflow-x-auto flex-grow">
              <LayersIcon className="mr-2" />
              <Typography
                variant="h6"
                className={`text-sm flex-grow truncate whitespace-nowrap`}
              >
                {table.table_name}
              </Typography>
            </div>
            <div
              className={`transform transition-transform duration-300 ${
                openAccordions.includes(tableIndex) ? "rotate-180" : "rotate-0"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </div>
          </AccordionHeader>

          <AccordionBody className="pt-0 pl-2 border-l-2 border-blue-200">
            {table.column_headers.map((column, columnIndex) => (
              <div key={columnIndex} className="mb-2 pl-4">
                <AccordionHeader className="text-gray-700 text-sm cursor-pointer p-2 transition-colors duration-200 hover:text-blue-600 border-b-0 no-underline">
                  <div className="flex items-center">{column}</div>
                </AccordionHeader>
              </div>
            ))}
          </AccordionBody>
          <div className="border-t border-gray-300"></div>
        </Accordion>
      ))}
    </div>
  );
};

export default ColumnAccordion;
