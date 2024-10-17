import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type LineChartTemplateProps = {
  series: {
    name: string;
    data: number[];
  }[];
  title: string;
  categories: string[];
  height?: number;
};

const LineChartTemplate: React.FC<LineChartTemplateProps> = ({
  series,
  title,
  categories,
  height = 350,
}) => {
  const options: ApexOptions = {
    chart: {
      height,
      type: "line",
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: title,
      align: "left",
    },
    xaxis: {
      categories,
    },
  };

  return (
    <Chart options={options} series={series} type="line" height={height} />
  );
};

export default LineChartTemplate;
