import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts';

interface LineColumnChartProps {
  columnData: number[];
  lineData: number[];
  columnName?: string;
  lineName?: string;
  chartTitle?: string;
  labels: string[];
}

const LineColumnChartTemplate: React.FC<LineColumnChartProps> = ({
  columnData,
  lineData,
  columnName = 'Column',
  lineName = 'Line',
  chartTitle = 'Line & Column Chart',
  labels,
}) => {
  useEffect(() => {
    const options: ApexOptions = {
      series: [
        {
          name: columnName,
          type: 'column',
          data: columnData,
        },
        {
          name: lineName,
          type: 'line',
          data: lineData,
        },
      ],
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: chartTitle,
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: labels,
      yaxis: [
        {
          title: {
            text: columnName,
          },
        },
        {
          opposite: true,
          title: {
            text: lineName,
          },
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector("#line-column-chart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [columnData, lineData, columnName, lineName, chartTitle, labels]);

  return <div id="line-column-chart" />;
};

export default LineColumnChartTemplate;