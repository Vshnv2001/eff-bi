"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Chart } from "../Chart";
import { ApexOptions } from "apexcharts";
import { generateColors } from "../colorUtils";
import html2canvas from "html2canvas";
import Stack from "@mui/material/Stack";

export interface TrafficProps {
  chartSeries: number[];
  labels: string[];
  sx?: SxProps;
  title?: string;
  description?: string;
}

export function DonutChartTemplate({
  chartSeries,
  labels,
  title,
  description,
}: TrafficProps): React.JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [baseColor, setBaseColor] = React.useState<string>("#ff0000");
  const themeColors = generateColors(
    chartSeries.length,
    "homogeneous",
    baseColor
  ); // Set color theme to homogeneous
  const chartOptions = useChartOptions(labels, themeColors);
  const chartRef = React.useRef<HTMLDivElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format: string) => {
    const chartElement = chartRef.current;

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
        a.download = "donut-chart.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } else if (format === "PNG") {
      const canvas = await html2canvas(chartElement);
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "donut-chart.png";
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
    <div style={{ position: "relative", textAlign: "center" }}>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}>
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
        <div>
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
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            style={{ marginLeft: "8px" }}
          />
        </div>
      </div>
      <Stack spacing={2} style={{ marginTop: 16 }}>
        <Chart
          height={300}
          options={chartOptions}
          series={chartSeries}
          type="donut"
          width="100%"
          ref={chartRef}
        />
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          {chartSeries.map((item, index) => {
            const label = labels[index];

            return (
              <Stack key={label} spacing={1} sx={{ alignItems: "center" }}>
                <Typography variant="h6">{label}</Typography>
                <Typography color="text.secondary" variant="subtitle2">
                  {item}%
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </div>
  );
}

function useChartOptions(labels: string[], colors: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: "transparent", toolbar: { show: false } },
    colors: colors,
    dataLabels: { enabled: false },
    labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: {
      active: { filter: { type: "none" } },
      hover: { filter: { type: "none" } },
    },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };
}
