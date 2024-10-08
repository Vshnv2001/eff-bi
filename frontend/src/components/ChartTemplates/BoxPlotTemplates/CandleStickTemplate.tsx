import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

type CandlestickData = {
  x: Date | number;
  y: [number, number, number, number];
};

interface CandlestickChartProps {
  data: CandlestickData[];
  title?: string;
  height?: number;
}

const CandlestickTemplate: React.FC<CandlestickChartProps> = ({ data, title = 'Candlestick Chart', height = 350 }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      series: [{
        data: data
      }],
      chart: {
        type: 'candlestick',
        height: height,
      },
      title: {
        text: title,
        align: 'left'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => chart.destroy();
  }, [data, title, height]);

  return <div ref={chartRef}></div>;
};

export default CandlestickTemplate;