import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { ApexOptions } from "apexcharts";
import html2canvas from "html2canvas";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { BACKEND_API_URL } from "../../../config/index";
import { Spinner } from "@material-tailwind/react";
import RefreshIcon from "@mui/icons-material/Refresh";

interface PieChartTemplateProps {
  series: number[];
  labels: string[];
  chartWidth?: number;
  title: string;
  description: string;
  id: number;
}

const PieChartTemplate: React.FC<PieChartTemplateProps> = ({
  series,
  labels,
  chartWidth = 500,
  title,
  description,
  id,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chartSeries, setChartSeries] = useState(series);
  useEffect(() => {
    const fontSize = chartSeries.length > 10 ? "12px" : "14px";

    console.log("series", chartSeries);
    console.log("labels", labels);

    if (chartSeries.length === 0 || labels.length === 0) {
      return;
    }

    const generateColors = (count: number) => {
      const colors = [];
      const baseHue = 30;
      for (let i = 0; i < count; i++) {
        colors.push(`hsl(${(baseHue + (i * 360) / count) % 360}, 70%, 50%)`);
      }
      return colors;
    };

    const options: ApexOptions = {
      series: chartSeries,
      chart: {
        width: "100%",
        type: "pie",
      },
      labels: labels,
      colors: generateColors(chartSeries.length),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: {
              height: 200,
            },
          },
        },
      ],
      legend: {
        position: "right",
        fontSize: fontSize,
        floating: false,
        formatter: function (seriesName, opts) {
          return seriesName + ` - ${chartSeries[opts.seriesIndex].toFixed(1)}`;
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (value) => `${value.toFixed(1)}%`,
        },
      },
    };

    const chart = new ApexCharts(chartRef.current as HTMLElement, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [chartSeries, labels, chartWidth]);

  const handleDownload = async (format: string) => {
    if (format === "SVG") {
      const svgData = chartRef.current?.querySelector("svg");
      if (svgData) {
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svgData)], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pie-chart.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } else if (format === "PNG" || format === "JPEG" || format === "JPG") {
      const canvas = await html2canvas(chartRef.current as HTMLElement);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `pie-chart.${format.toLowerCase()}`;
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

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_API_URL}/api/refresh-dashboard-tile/`, {
        tile_id: id,
      });
      setChartSeries(response.data.data.tile_props.series);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div style={{ position: "relative", marginTop: 30 }}>
      <div style={{ position: "absolute", top: -20, right: 10, zIndex: 1 }}>
        <IconButton onClick={handleRefresh} size="small">
          <RefreshIcon />
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
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
            }}
          >
            Download as SVG
          </MenuItem>
          <MenuItem
            onClick={() => handleDownload("PNG")}
            sx={{
              typography: "body2",
              color: "text.primary",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
            }}
          >
            Download as PNG
          </MenuItem>
          <MenuItem
            onClick={() => handleDownload("JPG")}
            sx={{
              typography: "body2",
              color: "text.primary",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
            }}
          >
            Download as JPG
          </MenuItem>
          <MenuItem
            onClick={() => handleDownload("JPEG")}
            sx={{
              typography: "body2",
              color: "text.primary",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
            }}
          >
            Download as JPEG
          </MenuItem>
        </Menu>
      </div>

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

      {chartSeries.length === 0 || labels.length === 0 ? (
        <Typography
          variant="body2"
          style={{ textAlign: "center", marginTop: 20, color: "red" }}
        >
          Query returned empty result, so no visualization needed.
        </Typography>
      ) : (
        <div
          ref={chartRef}
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        />
      )}
    </div>
  );
};

export default PieChartTemplate;
