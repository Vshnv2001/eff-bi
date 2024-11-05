import React from "react";
import Chart from "react-apexcharts";
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
}

const ScatterChartTemplate: React.FC<ScatterChartProps> = ({
  series,
  chartHeight = 350,
  title,
  description
}) => {
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

      <Chart options={options} series={series} type="scatter" height={250} width="100%" />
    </div>
  );
};

export default ScatterChartTemplate;