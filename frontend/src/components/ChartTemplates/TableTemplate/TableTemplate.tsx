import { Card, CardBody } from "@material-tailwind/react";
import Typography from "@mui/material/Typography";
import { Alert } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import Stack from "@mui/material/Stack";

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
  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography className="text-lg text-gray-600">
          No Data Available
        </Typography>
      </div>
    );
  }

  const columns = data.map((row) => row.label);

  const maxLength = Math.max(...data.map((column) => column.values.length));
  const rows = Array.from({ length: maxLength }, (_, rowIndex) =>
    data.reduce(
      (acc, column) => {
        acc[column.label] =
          column.values[rowIndex] !== undefined
            ? column.values[rowIndex]
            : "N/A";
        return acc;
      },
      {} as Record<string, string | number>
    )
  );

  return (
    <Card className="overflow-x-auto w-full p-5">
      {/* Title */}
      {title && (
        <Typography
          variant="h5"
          style={{ textAlign: "center", marginBottom: 10 }}
          className="font-semibold text-gray-800"
        >
          {title}
        </Typography>
      )}

      {/* Description */}
      {description && (
        <Alert
          severity="info"
          icon={<AutoAwesomeOutlinedIcon />}
          className="mb-4"
          sx={{ borderRadius: 4, boxShadow: 1 }}
        >
          <Stack spacing={2}>
            <Typography variant="h6" className="font-medium">
              Table Description
            </Typography>
            <Typography className="text-black">{description}</Typography>
          </Stack>
        </Alert>
      )}

      <CardBody className="px-5 py-4">
        <div className="overflow-y-auto max-h-96">
          <table className="w-auto min-w-full table-auto text-left">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="bg-blue-gray-50/50 px-4 py-2">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b">
                  {columns.map((column, j) => (
                    <td key={j} className="px-4 py-2">
                      {row[column]}
                    </td>
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
