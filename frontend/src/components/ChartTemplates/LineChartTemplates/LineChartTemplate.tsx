import React, { useRef } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Typography } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";

type LineChartTemplateProps = {
  series: {
    name: string;
    data: number[];
  }[];
  categories: string[];
  title: string;
  description: string;
};

const LineChartTemplate: React.FC<LineChartTemplateProps> = ({
  series,
  categories,
  title,
  description,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const options: ApexOptions = {
    chart: {
      type: "line",
      zoom: {
        enabled: true,
      },
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories,
      labels: {
        show: true,
      },
    },
    yaxis: {
      title: {
        text: series.length > 0 ? series[0].name : "",
      },
    },
    legend: {
      show: false,
    },
  };

  return (
    <div ref={chartRef}>
      {/* Title and Description */}
      <Typography
        variant="h6"
        style={{ textAlign: "center", marginBottom: 0 }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        style={{ textAlign: "center", marginBottom: -30 }}
      >
        {description}
      </Typography>

      {/* Chart Display */}
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
            type="line"
            height={200}
            width="100%"
            style={{ marginBottom: -30 }}
          />
        )}
      </CardContent>
    </div>
  );
};

export default LineChartTemplate;
