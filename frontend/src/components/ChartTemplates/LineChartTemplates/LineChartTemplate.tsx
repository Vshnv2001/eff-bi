import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

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
  categories,
  height = 350,
}) => {
  const options: ApexOptions = {
    chart: {
      height,
      type: 'line',
      zoom: {
        enabled: false,
      },
      background: '#fff',
    },
    xaxis: {
      categories,
    },
    yaxis: {
    },
    grid: {
      borderColor: '#e7e7e7',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: ['#FFA500'],
    },
    tooltip: {
      theme: 'light',
    },
  };

  return <Chart options={options} series={series} type="line" height={height} />;
};

export default LineChartTemplate;