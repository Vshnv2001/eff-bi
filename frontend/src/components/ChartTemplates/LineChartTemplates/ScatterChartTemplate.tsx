import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts';

interface ScatterChartProps {
  series: {
    name: string;
    data: [number, number][];
  }[];
  chartHeight?: number; // Optional chart height
}

const ScatterChartTemplate: React.FC<ScatterChartProps> = ({
  series,
  chartHeight = 350, // Default chart height
}) => {
  useEffect(() => {
    const options: ApexOptions = {
      series: series,
      chart: {
        height: chartHeight,
        type: 'scatter',
        zoom: {
          enabled: true,
          type: 'xy',
        },
      },
      xaxis: {
        tickAmount: 10,
        labels: {
          formatter: function(val) {
            return parseFloat(val as any).toFixed(1);
          },
        },
      },
      yaxis: {
        tickAmount: 7,
      },
    };

    const chart = new ApexCharts(document.querySelector("#scatter-chart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [series, chartHeight]);

  return <div id="scatter-chart" />;
};

export default ScatterChartTemplate;
