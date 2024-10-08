import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts';

interface PieChartTemplateProps {
  series: number[];
  labels: string[];
  chartWidth?: number;
}

const PieChartTemplate: React.FC<PieChartTemplateProps> = ({
  series,
  labels,
  chartWidth = 380,
}) => {
  useEffect(() => {
    const options: ApexOptions = {
      series: series,
      chart: {
        width: chartWidth,
        type: 'pie',
      },
      labels: labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector("#pie-chart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [series, labels, chartWidth]);

  return <div id="pie-chart" />;
};

export default PieChartTemplate;