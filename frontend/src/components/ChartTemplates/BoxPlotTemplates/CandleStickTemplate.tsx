import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import Typography from "@mui/material/Typography";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Spinner } from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../../../config";


type CandlestickData = {
  x: Date | number;
  y: [number, number, number, number];
};

interface CandlestickChartProps {
  data: CandlestickData[];
  title: string;
  description: string;
  height?: number;
  id: number;
}

const CandlestickTemplate: React.FC<CandlestickChartProps> = ({
  data,
  title,
  description,
  height = 350,
  id,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      series: [
        {
          data: currData,
        },
      ],
      chart: {
        type: "candlestick",
        height: height,
        toolbar: { show: false },
      },
      title: {
        text: title,
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
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => chart.destroy();
  }, [data, title, height]);

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

      <div ref={chartRef}></div>
    </div>
  );
};

export default CandlestickTemplate;
