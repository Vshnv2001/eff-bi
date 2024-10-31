"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Chart } from "../Chart";
import { ApexOptions } from "apexcharts";
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
  const chartOptions = useChartOptions(labels, chartSeries);
  const chartRef = React.useRef<HTMLDivElement | null>(null);

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
      </Box>

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
