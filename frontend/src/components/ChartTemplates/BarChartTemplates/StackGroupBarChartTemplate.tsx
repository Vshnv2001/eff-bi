"use client";

import * as React from "react";
import ApexCharts from "apexcharts";
import type { ApexOptions } from "apexcharts";
import { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Spinner } from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../../../config";
import RefreshIcon from "@mui/icons-material/Refresh";

export interface StackedBarChartProps {
  chartSeries: { name: string; group: string; data: number[] }[];
  categories: string[];
  title: string;
  description: string;
  sx?: SxProps;
  id: number;
}

export function StackedGroupBarChartTemplate({
  chartSeries,
  categories,
  title,
  description,
  id,
}: StackedBarChartProps): React.JSX.Element {
  const chartOptions = useChartOptions(chartSeries, categories);

  React.useEffect(() => {
    const chart = new ApexCharts(
      document.querySelector("#stacked-bar-chart"),
      chartOptions
    );
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [chartOptions]);

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

      <div id="stacked-bar-chart" style={{ width: "100%", height: "350px" }} />
    </div>
  );
}

function useChartOptions(
  chartSeries: { name: string; group: string; data: number[] }[],
  categories: string[]
): ApexOptions {
  return {
    series: chartSeries,
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: { show: false },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    dataLabels: {
      formatter: (val: number | string) => {
        return `${Number(val) / 1000}K`;
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        formatter: (val: number | string) => {
          return `${Number(val) / 1000}K`;
        },
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#80c7fd", "#008FFB", "#80f1cb", "#00E396"],
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
  };
}
