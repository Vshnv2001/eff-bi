import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts';

interface RadarChartProps {
  series: { name: string; data: number[] }[];
  categories: string[];
  chartHeight?: number;
}

const RadarChartTemplate: React.FC<RadarChartProps> = ({
  series,
  categories,
  chartHeight = 350,
}) => {
  useEffect(() => {
    const options: ApexOptions = {
      series: series,
      chart: {
        height: chartHeight,
        type: 'radar',
      },
      title: {
        text: 'Radar Chart',
      },
      yaxis: {
        stepSize: 20,
      },
      xaxis: {
        categories: categories,
      },
    };

    const chart = new ApexCharts(document.querySelector("#radar-chart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [series, categories, chartHeight]);

  return <div id="radar-chart" />;
};

export default RadarChartTemplate;