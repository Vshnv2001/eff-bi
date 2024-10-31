import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { ApexOptions } from "apexcharts";
import { Typography } from "@mui/material";

interface PolarChartProps {
  series: number[];
  chartWidth?: number;
  title?: string;
  description?: string;
  id: number;
}

const PolarChartTemplate: React.FC<PolarChartProps> = ({
  series,
  chartWidth = 380,
  title,
  description,
  id,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const options: ApexOptions = {
      series: chartSeries,
      chart: {
        type: "polarArea",
        width: chartWidth,
        toolbar: { show: false },
      },
      stroke: {
        colors: ["#fff"],
      },
      fill: {
        opacity: 0.8,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(chartRef.current as HTMLElement, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [series, chartWidth]);

  return (
    <div>
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
      <div ref={chartRef} id="polar-chart" />
    </div>
  );
};

export default PolarChartTemplate;
