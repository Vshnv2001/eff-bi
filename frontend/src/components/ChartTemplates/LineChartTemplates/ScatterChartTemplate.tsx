import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Typography } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";

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
  description,
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
      <Typography variant="h6" style={{ textAlign: "center", marginBottom: 0 }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        style={{ textAlign: "center", marginBottom: -30 }}
      >
        {description}
      </Typography>

      <CardContent>
        {series.length === 0 ? (
          <Typography
            variant="body1"
            style={{ textAlign: "center", color: "gray", marginTop: 0 }}
          >
            Query returned empty result, so no visualization needed.
          </Typography>
        ) : (
          <Chart
            options={options}
            series={series}
            type="scatter"
            height={200}
            width="100%"
          />
        )}
      </CardContent>
      <Divider />
    </div>
  );
};

export default ScatterChartTemplate;
