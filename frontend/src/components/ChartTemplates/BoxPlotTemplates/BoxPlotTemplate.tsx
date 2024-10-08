import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

type BoxPlotData = {
  x: string;
  y: number[];
};

type BoxPlotTemplateProps = {
  data: BoxPlotData[];
  title: string;
  height?: number;
};

const BoxPlotTemplate: React.FC<BoxPlotTemplateProps> = ({ data, title, height = 350 }) => {
  useEffect(() => {
    const options = {
      series: [
        {
          type: 'boxPlot',
          data: data
        }
      ],
      chart: {
        type: 'boxPlot',
        height: height
      },
      title: {
        text: title,
        align: 'left'
      },
      plotOptions: {
        boxPlot: {
          colors: {
            upper: '#5C4742',
            lower: '#A5978B'
          }
        }
      }
    };

    const chart = new ApexCharts(document.querySelector("#boxplot-chart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data, title, height]);

  return <div id="boxplot-chart" />;
};

export default BoxPlotTemplate;