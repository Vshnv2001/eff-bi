"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import type { ApexOptions } from "apexcharts";
import { Chart } from "../Chart";
import Typography from "@mui/material/Typography";

export interface HorizontalBarChartProps {
  chartSeries: { name: string; data: number[] }[];
  categories: string[];
  title: string;
  description: string;
}

export function PyramidBarChartTemplate({
  chartSeries,
  categories,
  title,
  description,
}: HorizontalBarChartProps): React.JSX.Element {
  const chartOptions = useChartOptions(categories);

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
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

      {/* Chart component */}
      <div style={{ marginTop: 30 }}>
        {chartSeries.length === 0 ? (
          <Typography
            variant="body2"
            style={{ textAlign: "center", margin: "20px 0" }}
          >
            No data available to display the chart.
          </Typography>
        ) : (
          <Chart
            height="200%"
            options={chartOptions}
            series={chartSeries}
            type="bar"
            width="100%"
          />
        )}
      </div>
    </div>
  );
}

function useChartOptions(categories: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: true,
      toolbar: { show: false },
    },
    colors: ["#008FFB", "#FF4560"],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: "solid" },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    legend: { show: false },
    plotOptions: { bar: { horizontal: true } },
    stroke: { colors: ["transparent"], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      categories: categories,
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.secondary },
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: (val) => `${Math.abs(val)}%`,
      },
    },
  };
}
