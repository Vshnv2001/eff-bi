import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { ApexOptions } from "apexcharts";
import { Typography } from "@mui/material";

interface ScatterChartProps {
  series: {
    name: string;
    data: [number, number][];
  }[];
  chartHeight?: number;
  title?: string;
  description?: string;
  id: number;
}

const ScatterChartTemplate: React.FC<ScatterChartProps> = ({
  series,
  chartHeight = 350,
  title,
  description,
  id,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options: ApexOptions = {
      series: series,
      chart: {
        height: chartHeight,
        type: "scatter",
        zoom: {
          enabled: true,
          type: "xy",
        },
        toolbar: { show: false },
      },
      xaxis: {
        tickAmount: 10,
        labels: {
          formatter: function (val) {
            return parseFloat(val as any).toFixed(1);
          },
        },
      },
      yaxis: {
        tickAmount: 7,
      },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [series, chartHeight]);

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

      <div ref={chartRef} id="scatter-chart" />
    </div>
  );
};

export default ScatterChartTemplate;
