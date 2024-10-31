import React, { useRef } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Typography } from "@mui/material";

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
    },
    yaxis: {
      title: {
        text: series.length > 0 ? series[0].name : "",
      },
    },
  };

  return (
    <div ref={chartRef}>
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
      <Chart options={options} series={series} type="line" height={400} />
    </div>
  );
};

export default LineChartTemplate;