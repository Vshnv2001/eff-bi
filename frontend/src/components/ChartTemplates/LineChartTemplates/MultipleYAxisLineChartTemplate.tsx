import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts';

interface MultipleYAxisLineChartProps {
  incomeData: number[];
  cashflowData: number[];
  revenueData: number[];
  categories: number[];
  chartTitle?: string;
}

const MultipleYAxisLineChartTemplate: React.FC<MultipleYAxisLineChartProps> = ({
  incomeData,
  cashflowData,
  revenueData,
  categories,
  chartTitle = 'XYZ - Stock Analysis (2009 - 2016)',
}) => {
  useEffect(() => {
    const options: ApexOptions = {
      series: [
        {
          name: 'Income',
          type: 'column',
          data: incomeData,
        },
        {
          name: 'Cashflow',
          type: 'column',
          data: cashflowData,
        },
        {
          name: 'Revenue',
          type: 'line',
          data: revenueData,
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [1, 1, 4],
      },
      title: {
        text: chartTitle,
        align: 'left',
        offsetX: 110,
      },
      xaxis: {
        categories: categories,
      },
      yaxis: [
        {
          seriesName: 'Income',
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB',
          },
          labels: {
            style: {
              colors: '#008FFB',
            },
          },
          title: {
            text: 'Income (thousand crores)',
            style: {
              color: '#008FFB',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          seriesName: 'Cashflow',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396',
          },
          labels: {
            style: {
              colors: '#00E396',
            },
          },
          title: {
            text: 'Operating Cashflow (thousand crores)',
            style: {
              color: '#00E396',
            },
          },
        },
        {
          seriesName: 'Revenue',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#FEB019',
          },
          labels: {
            style: {
              colors: '#FEB019',
            },
          },
          title: {
            text: 'Revenue (thousand crores)',
            style: {
              color: '#FEB019',
            },
          },
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft',
          offsetY: 30,
          offsetX: 60,
        },
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40,
      },
    };

    const chart = new ApexCharts(document.querySelector("#multiple-y-axis-chart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [incomeData, cashflowData, revenueData, categories, chartTitle]);

  return <div id="multiple-y-axis-chart" />;
};

export default MultipleYAxisLineChartTemplate;