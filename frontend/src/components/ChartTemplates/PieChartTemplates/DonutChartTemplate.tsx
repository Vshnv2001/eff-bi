"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Select from "@mui/material/Select";
import { Chart } from "../Chart";
import { ApexOptions } from "apexcharts";
import { generateColors } from "../colorUtils";
import html2canvas from "html2canvas";

type ColorTheme = "homogeneous" | "analogous" | "complementary" | "triadic";

export interface TrafficProps {
  chartSeries: number[];
  labels: string[];
  sx?: SxProps;
}

export function DonutChartTemplate({
  chartSeries,
  labels,
  sx,
}: TrafficProps): React.JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>("homogeneous");
  const [baseColor, setBaseColor] = React.useState<string>("#ff0000");
  const themeColors = generateColors(chartSeries.length, colorTheme, baseColor);
  const chartOptions = useChartOptions(labels, themeColors);
  const chartRef = React.useRef<HTMLDivElement>(null); // Ref to access the chart DOM element

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
    <Card sx={sx} ref={chartRef}>
      <CardHeader
        action={
          <div>
            <IconButton onClick={handleMenuClick} size="small">
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleDownload("SVG")}>
                Download as SVG
              </MenuItem>
              <MenuItem onClick={() => handleDownload("PNG")}>
                Download as PNG
              </MenuItem>
            </Menu>
            <Select
              value={colorTheme}
              onChange={(e) => setColorTheme(e.target.value as ColorTheme)}
              variant="outlined"
              size="small"
              sx={{ ml: 1 }}
            >
              <MenuItem value="homogeneous">Homogeneous</MenuItem>
              <MenuItem value="analogous">Analogous</MenuItem>
              <MenuItem value="complementary">Complementary</MenuItem>
              <MenuItem value="triadic">Triadic</MenuItem>
            </Select>

            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              style={{ marginLeft: "8px" }}
            />
          </div>
        }
        title="Traffic Source"
      />
      <CardContent>
        <Stack spacing={2}>
          <Chart
            height={300}
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width="100%"
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
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[], colors: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: "transparent" },
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