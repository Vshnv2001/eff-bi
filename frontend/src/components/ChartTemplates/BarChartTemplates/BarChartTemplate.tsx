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
  const yAxisLabel = "";
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
  xAxisLabel: string,
  yAxisLabel: string
): ApexOptions {
  const theme = useTheme();

  const columnWidth = Math.max(40, 100 / categories.length);

  const generateBlueShades = (count: number): string[] => {
    const shades: string[] = [];
    for (let i = 0; i < count; i++) {
      const lightness = 40 + i * (60 / count);
      shades.push(`hsl(210, 100%, ${lightness}%)`);
    }
    return shades;
  };

  const colors = generateBlueShades(categories.length);

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
      labels: { show: true },
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
