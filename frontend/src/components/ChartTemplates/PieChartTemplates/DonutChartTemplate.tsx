"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Chart } from "../Chart";
import { ApexOptions } from "apexcharts";
import { generateColors } from "../colorUtils";
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
  const [baseColor, setBaseColor] = React.useState<string>("#ff0000");
  const themeColors = generateColors(
    chartSeries.length,
    "homogeneous",
    baseColor
  ); // Set color theme to homogeneous
  const chartOptions = useChartOptions(labels, themeColors);
  const chartRef = React.useRef<HTMLDivElement>(null);

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
