import { Card, CardBody } from "@material-tailwind/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import html2canvas from "html2canvas";
import React from "react";
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const chartRef = React.useRef<HTMLDivElement | null>(null);

  // Handle empty data case
  if (!data.length) {
    return (
      <Card className="overflow-x-auto w-full">
        <Typography
          variant="h6"
          style={{ textAlign: "center", marginBottom: 10 }}
        >
          No Data Available
        </Typography>
      </Card>
    );
  }

  const maxRows = Math.max(...data.map((column) => column.values.length)); // Find the maximum number of rows
  const rows = Array.from({ length: maxRows }, (_, rowIndex) => {
    return data.reduce((acc, column) => {
      acc[column.label] =
        column.values[rowIndex] !== undefined ? column.values[rowIndex] : "N/A"; // Handle undefined values
      return acc;
    }, {} as Record<string, string | number>);
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format: string) => {
    const chartElement = document.querySelector(
      ".apexcharts-canvas"
    ) as HTMLElement;

    if (!chartElement) return;

    if (format === "SVG") {
      const svgData = chartElement.querySelector("svg");
      if (svgData) {
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svgData)], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "chart.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } else if (format === "PNG" || format === "JPEG" || format === "JPG") {
      const canvas = await html2canvas(chartElement);
      canvas.toBlob(
        (blob: Blob | null) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `chart.${format.toLowerCase()}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        },
        format === "JPEG" ? "image/jpeg" : undefined
      );
    }

    handleClose();
  };

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
      <div className="flex justify-end">
        <IconButton onClick={handleMenuClick} size="small">
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              borderRadius: 8,
              marginTop: 5,
            },
          }}
        >
          <MenuItem onClick={() => handleDownload("SVG")}>
            Download as SVG
          </MenuItem>
          <MenuItem onClick={() => handleDownload("PNG")}>
            Download as PNG
          </MenuItem>
          <MenuItem onClick={() => handleDownload("JPG")}>
            Download as JPG
          </MenuItem>
          <MenuItem onClick={() => handleDownload("JPEG")}>
            Download as JPEG
          </MenuItem>
        </Menu>
      </div>
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
