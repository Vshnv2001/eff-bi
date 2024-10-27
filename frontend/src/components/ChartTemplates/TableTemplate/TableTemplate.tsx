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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format: string) => {
    if (format === "SVG") {
      const svgElement = chartRef.current?.querySelector("svg");
      if (svgElement) {
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svgElement)], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "table.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } else if (format === "PNG") {
      const canvas = await html2canvas(chartRef.current as HTMLElement);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "table.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
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
          <MenuItem
            onClick={() => handleDownload("SVG")}
            sx={{
              typography: "body2",
              color: "text.primary",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            Download as SVG
          </MenuItem>
          <MenuItem
            onClick={() => handleDownload("PNG")}
            sx={{
              typography: "body2",
              color: "text.primary",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            Download as PNG
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
              {data[0].values.map((_, i) => (
                <tr key={i}>
                  {data.map((row, j) => (
                    <td key={j}>{row.values[i]}</td>
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
