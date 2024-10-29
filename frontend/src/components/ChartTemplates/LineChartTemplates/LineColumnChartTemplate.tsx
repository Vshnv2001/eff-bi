import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { ApexOptions } from "apexcharts";
import html2canvas from "html2canvas";
import { Menu, MenuItem, IconButton, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Spinner } from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../../../config";
import RefreshIcon from "@mui/icons-material/Refresh";

interface LineColumnChartProps {
  columnData: number[];
  lineData: number[];
  columnName: string;
  lineName: string;
  title: string;
  description?: string;
  labels: string[];
  id: number;
}

const LineColumnChartTemplate: React.FC<LineColumnChartProps> = ({
  columnData,
  lineData,
  columnName,
  lineName,
  title,
  description,
  labels,
  id,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currColumnData, setCurrColumnData] = useState(columnData);
  const [currLineData, setCurrLineData] = useState(lineData);
  const chartRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const options: ApexOptions = {
      series: [
        {
          name: columnName,
          type: "column",
          data: currColumnData,
        },
        {
          name: lineName,
          type: "line",
          data: currLineData,
        },
      ],
      chart: {
        height: 350,
        type: "line",
        toolbar: { show: false },
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: title,
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: labels,
      yaxis: [
        {
          title: {
            text: columnName,
          },
        },
        {
          opposite: true,
          title: {
            text: lineName,
          },
        },
      ],
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [currColumnData, currLineData, columnName, lineName, title, labels]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isLoading) {
    return <Spinner />;
  }

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_API_URL}/api/refresh-dashboard-tile/`, {
        tile_id: id,
      });
      setCurrColumnData(response.data.data.tile_props.column_data);
      setCurrLineData(response.data.data.tile_props.line_data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

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
    <div>
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
        <IconButton
          onClick={handleRefresh}
          className="mb-2"
        >
          <RefreshIcon />
        </IconButton>
        <IconButton
          onClick={handleMenuClick}
        size="small"
        style={{ marginBottom: "10px" }}
      >
          <MoreVertIcon />
        </IconButton>
      </div>
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
        <MenuItem
          onClick={() => handleDownload("JPG")}
          sx={{
            typography: "body2",
            color: "text.primary",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          Download as JPG
        </MenuItem>
        <MenuItem
          onClick={() => handleDownload("JPEG")}
          sx={{
            typography: "body2",
            color: "text.primary",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          Download as JPEG
        </MenuItem>
      </Menu>
      <div ref={chartRef} id="line-column-chart" />
    </div>
  );
};

export default LineColumnChartTemplate;
