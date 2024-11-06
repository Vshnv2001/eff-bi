"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import type { ApexOptions } from "apexcharts";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { Chart } from "../Chart";
import Typography from "@mui/material/Typography";

export interface HorizontalBarChartProps {
  chartSeries: { name: string; data: number[] }[];
  categories: string[];
  title: string;
  description: string;
  id: number;
}

export function HorizontalBarChartTemplate({
  chartSeries = [],
  categories = [],
  title = "",
  description = "",
}: HorizontalBarChartProps): React.JSX.Element {
  const xAxisLabel = chartSeries.length > 0 ? chartSeries[0].name : "Value";
  const chartOptions = useChartOptions(categories, xAxisLabel);

  return (
    <div style={{ position: "relative", marginTop: 0 }}>
      {/* Title and Description */}
      <Typography
        variant="h6"
        style={{ textAlign: "center", marginBottom: -30 }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        style={{ textAlign: "center", marginBottom: 0 }}
      >
        {description}
      </Typography>

      <CardContent>
        {chartSeries.length === 0 ? (
          <Typography
            variant="body2"
            style={{ textAlign: "center", margin: "20px 0" }}
          >
            No data available to display the chart.
          </Typography>
        ) : (
          <Chart
            height={200}
            options={chartOptions}
            series={chartSeries}
            type="bar"
            width="100%"
            style={{ marginBottom: -30 }}
          />
        )}
      </CardContent>
      <Divider />
    </div>
  );
}

function useChartOptions(
  categories: string[],
  xAxisLabel: string
): ApexOptions {
  const theme = useTheme();

  const generateColors = (count: number): string[] => {
    const colors = [];
    const baseHue = 30;
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${(baseHue + (i * 360) / count) % 360}, 70%, 50%)`);
    }
    return colors;
  };

  const colors = generateColors(categories.length);

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: { show: false },
    },
    colors: colors,
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
      labels: { offsetY: 0, style: { colors: theme.palette.text.secondary } },
      title: { text: xAxisLabel, style: { color: theme.palette.text.primary } },
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.secondary },
        formatter: (value: any) => {
          return typeof value === "number" ? value.toFixed(2) : value;
        },
      },
    },
  };
}
