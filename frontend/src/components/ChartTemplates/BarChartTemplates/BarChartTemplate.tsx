import * as React from "react";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import type { ApexOptions } from "apexcharts";
import { Chart } from "../Chart";
import Typography from "@mui/material/Typography";

export interface BarProps {
  chartSeries: { name: string; data: number[] }[];
  categories: string[];
  xAxisLabel: string;
  title: string;
  description: string;
}

export function BarChartTemplate({
  chartSeries,
  categories,
  xAxisLabel,
  title,
  description,
}: BarProps): React.JSX.Element {
  const yAxisLabel = chartSeries.length === 1 ? chartSeries[0].name : "";
  const chartOptions = useChartOptions(categories, xAxisLabel, yAxisLabel);

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
            variant="body1"
            style={{ textAlign: "center", color: "gray", marginTop: 0 }}
          >
            Query returned empty result, so no visualization needed.
          </Typography>
        ) : (
          <Chart
            height="250%"
            options={chartOptions}
            series={chartSeries}
            type="bar"
            width="100%"
            style={{ marginBottom: 0 }}
          />
        )}
      </CardContent>
    </div>
  );
}

function useChartOptions(
  categories: string[],
  xAxisLabel: string,
  yAxisLabel: string
): ApexOptions {
  const theme = useTheme();

  const columnWidth = Math.max(40, 100 / categories.length);

  const generateColors = (count: number): string[] => {
    const colors = [];
    const baseHue = 210;
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
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: `${columnWidth}%` } },
    stroke: { colors: ["transparent"], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: categories,
      labels: {
        show: true,
        style: { colors: theme.palette.text.secondary },
        formatter: (value: any) => {
          if (typeof value === "number") {
            return value.toFixed(2);
          } else if (typeof value === "string" && value.length > 25) {

            if (value.length >= 50) {
              value = value.slice(1);
            }

            let words = value.split(" ");

            const lines: string[] = [];
            let currentLine = "";

            for (const word of words) {
              if (currentLine.length + word.length + 1 > 25) {
                lines.push(currentLine.trim());
                currentLine = word;
              } else {
                currentLine += (currentLine ? " " : "") + word;
              }
            }

            if (currentLine.trim().length > 0) {
              lines.push(currentLine.trim());
            }
            return lines;
          }
          return value;
        },
      },
      title: { text: xAxisLabel, style: { color: theme.palette.text.primary } },
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toFixed(2),
        style: { colors: theme.palette.text.secondary },
      },
      title: {
        text: yAxisLabel,
        style: { color: theme.palette.text.secondary },
      },
    },
  };
}
