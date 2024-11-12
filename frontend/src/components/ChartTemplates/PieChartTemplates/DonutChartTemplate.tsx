"use client";

import * as React from "react";
import { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Chart } from "../Chart";
import { ApexOptions } from "apexcharts";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";

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
  const fontSize = chartSeries.length > 10 ? "12px" : "14px";

  const generateColors = (count: number): string[] => {
    const colors = [];
    const baseHue = 30;
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${(baseHue + (i * 360) / count) % 360}, 70%, 50%)`);
    }
    return colors;
  };

  const chartOptions: ApexOptions = {
    chart: {
      width: "100%",
      type: "donut",
    },
    labels: labels,
    plotOptions: {
      pie: {
        customScale: 1,
      },
    },
    colors: generateColors(chartSeries.length),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: "100%" },
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
      show: true,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `${value.toFixed(1)}%`,
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Typography variant="h6" style={{ textAlign: "center", marginBottom: 0 }}>
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
            style={{ textAlign: "center", marginTop: 20, color: "red" }}
          >
            Query returned empty result, so no visualization needed.
          </Typography>
        ) : (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width="100%"
            height="150%"
          />
        )}
      </CardContent>
    </div>
  );
}

export default DonutChartTemplate;
