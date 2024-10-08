import React, { useEffect } from "react";
import ApexCharts from "apexcharts";
import { ApexOptions } from "apexcharts";

interface RadarChartProps {
  series: { name: string; data: number[] }[];
  categories: string[];
  chartHeight?: number;
}

const RadarChartMultipleTemplate: React.FC<RadarChartProps> = ({
  series,
  categories,
  chartHeight = 350,
}) => {
  useEffect(() => {
    const options: ApexOptions = {
      series: series,
      chart: {
        height: chartHeight,
        type: "radar",
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1,
        },
      },
      title: {
        text: "Radar Chart - Multi Series",
      },
      stroke: {
        width: 2,
      },
      fill: {
        opacity: 0.1,
      },
      markers: {
        size: 0,
      },
      yaxis: {
        stepSize: 20,
      },
      xaxis: {
        categories: categories,
      },
    };

    const chart = new ApexCharts(
      document.querySelector("#radar-chart-multiple"),
      options
    );
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [series, categories, chartHeight]);

  return <div id="radar-chart-multiple" />;
};

export default RadarChartMultipleTemplate;
