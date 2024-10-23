import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts';
import html2canvas from 'html2canvas';

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
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const options: ApexOptions = {
      series: series,
      chart: {
        height: chartHeight,
        type: 'radar',
        toolbar: { show: false },
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

    const chart = new ApexCharts(chartRef.current as HTMLElement, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [series, categories, chartHeight]);

  const handleDownload = async (format: string) => {
    if (format === "SVG") {
      const svgData = chartRef.current?.querySelector("svg");
      if (svgData) {
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svgData)], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "radar-chart.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } else if (format === "PNG") {
      const canvas = await html2canvas(chartRef.current as HTMLElement);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "radar-chart.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  return (
    <div>
      <div ref={chartRef} id="radar-chart" />
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => handleDownload("SVG")}>Download as SVG</button>
        <button onClick={() => handleDownload("PNG")}>Download as PNG</button>
      </div>
    </div>
  );
};

export default RadarChartTemplate;