import React from "react";
import { Card, CardBody } from "@material-tailwind/react";
import Typography from "@mui/material/Typography";

interface TableData {
  label: string;
  values: (string | number)[];
}

interface TableTemplateProps {
  data: TableData[];
  title?: string;
  description?: string;
}

export default function TableTemplate({
  data,
  title,
  description,
}: TableTemplateProps) {
  const columns = data.map((row) => row.label);
  const chartRef = React.useRef<HTMLDivElement | null>(null);

  const rows = data[0].values.map((_, rowIndex) =>
    data.reduce((acc, column) => {
      acc[column.label] = column.values[rowIndex];
      return acc;
    }, {} as Record<string, string | number>)
  );

  return (
    <Card className="overflow-x-auto w-full">
      {/* Title and Description */}
      <Typography
        variant="h6"
        style={{ textAlign: "center", marginBottom: 10 }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        style={{ textAlign: "center", marginBottom: 20 }}
      >
        {description}
      </Typography>

      <CardBody ref={chartRef} className="px-5 py-4">
        <div className="overflow-y-auto max-h-96">
          <table className="w-auto min-w-full table-auto text-left">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="bg-blue-gray-50/50">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((column, j) => (
                    <td key={j}>{row[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
