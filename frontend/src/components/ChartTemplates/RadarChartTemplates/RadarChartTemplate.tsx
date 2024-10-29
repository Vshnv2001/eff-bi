import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { ApexOptions } from "apexcharts";
import html2canvas from "html2canvas";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { BACKEND_API_URL } from "../../../config/index";
import { Spinner } from "@material-tailwind/react";

interface RadarChartProps {
  series: { name: string; data: number[] }[];
  categories: string[];
  chartHeight?: number;
  title?: string;
  description?: string;
  id: number;
}

const RadarChartTemplate: React.FC<RadarChartProps> = ({
  series,
  categories,
  chartHeight = 350,
  title,
  description,
  id,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chartSeries, setChartSeries] = useState(series);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const options: ApexOptions = {
      series: chartSeries,
      chart: {
        height: chartHeight,
        type: "radar",
        toolbar: { show: false },
      },
      title: {
        text: "Radar Chart",
      },
      yaxis: {
        stepSize: 20,
      },
      xaxis: {
        categories: categories,
      },
    };

    const chart = new ApexCharts(chartRef.current as HTMLElement, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [chartSeries, categories, chartHeight]);

  const handleRefresh = async () => {
    console.log("Refresh clicked");
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_API_URL}/api/refresh-dashboard-tile/`, {
        tile_id: id,
      });
      console.log(response.data.data.tile_props.series);
      setChartSeries(response.data.data.tile_props.series);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isLoading) {
    return <Spinner />;
  }

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
      <div ref={chartRef} id="radar-chart" />
      <div style={{ marginTop: "10px" }}>
        <div className="flex items-center gap-2">
          <IconButton size="small">
            <RefreshIcon onClick={handleRefresh} />
          </IconButton>
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
        </div>
      </div>
    </div>
  );
};

export default RadarChartTemplate;
