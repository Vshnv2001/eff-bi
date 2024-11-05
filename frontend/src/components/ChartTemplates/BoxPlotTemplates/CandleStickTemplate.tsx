import React from "react";
import { Chart } from "../Chart";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ApexOptions } from "apexcharts";

type CandlestickData = {
  x: Date | number;
  y: [number, number, number, number];
};

interface CandlestickChartProps {
  data: CandlestickData[];
  title: string;
  description: string;
  height?: number;
}

const CandlestickTemplate: React.FC<CandlestickChartProps> = ({
  data,
  title,
  description,
  height = 350,
}) => {
  const chartOptions = useChartOptions(height);

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

      <div>
        {data.length === 0 ? (
          <Typography
            variant="body1"
            style={{ textAlign: "center", color: "gray" }}
          >
            No data available for visualization.
          </Typography>
        ) : (
          <Chart
            height={height}
            options={chartOptions}
            series={[{ data }]}
            type="candlestick"
            width="100%"
          />
        )}
      </div>
    </div>
  );
};

function useChartOptions(height: number): ApexOptions {
  const theme = useTheme();

  return {
    chart: {
      type: "candlestick",
      height: height,
      toolbar: { show: false },
    },
    title: {
      text: "",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
  };
}

export default CandlestickTemplate;