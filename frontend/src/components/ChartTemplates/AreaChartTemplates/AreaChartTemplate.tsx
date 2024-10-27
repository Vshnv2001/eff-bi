"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Typography from "@mui/material/Typography";
import { Chart } from "../Chart";
import { ApexOptions } from "apexcharts";
import html2canvas from "html2canvas";
import Box from "@mui/material/Box";

export interface AreaChartProps {
  chartSeries: { name: string; data: number[] }[];
  labels: string[];
  sx?: SxProps;
  title?: string;
  description?: string;
}

export function AreaChartTemplate({
  chartSeries,
  labels,
  sx,
  title = "Area Chart",
  description = "This area chart shows the trend of data over time.",
}: AreaChartProps): React.JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const chartOptions = useChartOptions(labels, chartSeries);
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
        a.download = "area-chart.svg";
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
            a.download = `area-chart.${format.toLowerCase()}`;
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

  // Check if chartSeries or labels are empty
  if (chartSeries.length === 0 || labels.length === 0) {
    return (
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 2,
          ...sx,
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          Query returned empty result, so no visualization needed.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, ...sx }}>
      {/* Title and Download Menu */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
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
        </Box>
        <IconButton onClick={handleMenuClick} size="small">
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Download Menu Options */}
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

      {/* Chart Display */}
      <div ref={chartRef} style={{ marginTop: 16 }}>
        <Chart
          height={400}
          options={chartOptions}
          series={chartSeries}
          type="area"
          width="100%"
        />
      </div>
    </Box>
  );
}

function useChartOptions(
  labels: string[],
  chartSeries: { name: string; data: number[] }[]
): ApexOptions {
  const theme = useTheme();

  const maxYValue = Math.max(...chartSeries.flatMap((series) => series.data));

  return {
    chart: {
      type: "area",
      zoom: { enabled: false },
      background: "transparent",
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    labels,
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      opposite: true,
      min: 0,
      max: maxYValue * 1.1,
    },
    legend: {
      horizontalAlign: "left",
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    theme: { mode: theme.palette.mode },
  };
}
