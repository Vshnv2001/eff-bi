"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { SxProps } from "@mui/material/styles";
import ApexCharts from "apexcharts";
import type { ApexOptions } from "apexcharts";

export interface StackedBarChartProps {
  chartSeries: { name: string; group: string; data: number[] }[];
  categories: string[];
  sx?: SxProps;
}

export function StackedGroupBarChartTemplate({
  chartSeries,
  categories,
  sx,
}: StackedBarChartProps): React.JSX.Element {
  const chartOptions = useChartOptions(chartSeries, categories);

  React.useEffect(() => {
    const chart = new ApexCharts(document.querySelector("#stacked-bar-chart"), chartOptions);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [chartOptions]);

  return (
    <Card sx={sx}>
      <CardHeader title="Stacked Bar Chart" />
      <CardContent>
        <div id="stacked-bar-chart" />
      </CardContent>
      <Divider />
    </Card>
  );
}

function useChartOptions(
  chartSeries: { name: string; group: string; data: number[] }[], 
  categories: string[]
): ApexOptions {
  return {
    series: chartSeries,
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
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
    colors: ['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
  };
}