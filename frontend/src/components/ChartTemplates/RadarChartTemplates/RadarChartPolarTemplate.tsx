import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts';

interface PolarChartProps {
  series: number[];
  chartWidth?: number;
}

const PolarChartTemplate: React.FC<PolarChartProps> = ({
  series,
  chartWidth = 380,
}) => {
  useEffect(() => {
    const options: ApexOptions = {
      series: series,
      chart: {
        type: 'polarArea',
        width: chartWidth,
      },
      stroke: {
        colors: ['#fff'],
      },
      fill: {
        opacity: 0.8,
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      }],
    };

    const chart = new ApexCharts(document.querySelector("#polar-chart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [series, chartWidth]);

  return <div id="polar-chart" />;
};

export default PolarChartTemplate;
