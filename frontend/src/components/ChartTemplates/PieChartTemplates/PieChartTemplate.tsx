import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { ApexOptions } from "apexcharts";
import { Typography } from "@mui/material";

interface PieChartTemplateProps {
  series: number[];
  labels: string[];
  chartWidth?: number;
  title: string;
  description: string;
  id: number;
}

const PieChartTemplate: React.FC<PieChartTemplateProps> = ({
  series,
  labels,
  chartWidth = 500,
  title,
  description,
  id,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fontSize = series.length > 10 ? "12px" : "14px";

    console.log("series", series);
    console.log("labels", labels);

    if (series.length === 0 || labels.length === 0) {
      return;
    }

    const generateColors = (count: number) => {
      const colors = [];
      const baseHue = 30;
      for (let i = 0; i < count; i++) {
        colors.push(`hsl(${(baseHue + (i * 360) / count) % 360}, 70%, 50%)`);
      }
      return colors;
    };

    const options: ApexOptions = {
      series: series,
      chart: {
        width: "100%",
        type: "pie",
      },
      labels: labels,
      colors: generateColors(series.length),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
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
          return seriesName + ` - ${series[opts.seriesIndex].toFixed(1)}`;
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (value) => `${value.toFixed(1)}%`,
        },
      },
    };

    const chart = new ApexCharts(chartRef.current as HTMLElement, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [series, labels, chartWidth]);

  return (
    <div style={{ position: "relative", marginTop: 30 }}>
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

      {series.length === 0 || labels.length === 0 ? (
        <Typography
          variant="body2"
          style={{ textAlign: "center", marginTop: 20, color: "red" }}
        >
          Query returned empty result, so no visualization needed.
        </Typography>
      ) : (
        <div
          ref={chartRef}
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        />
      )}
    </div>
  );
};

export default PieChartTemplate;
