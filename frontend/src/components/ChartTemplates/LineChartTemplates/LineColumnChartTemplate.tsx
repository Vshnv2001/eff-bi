import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { ApexOptions } from "apexcharts";
import { Typography } from "@mui/material";

interface LineColumnChartProps {
  columnData: number[];
  lineData: number[];
  columnName: string;
  lineName: string;
  title: string;
  description?: string;
  labels: string[];
  id: number;
}

const LineColumnChartTemplate: React.FC<LineColumnChartProps> = ({
  columnData,
  lineData,
  columnName,
  lineName,
  title,
  description,
  labels,
  id,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currColumnData, setCurrColumnData] = useState(columnData);
  const [currLineData, setCurrLineData] = useState(lineData);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options: ApexOptions = {
      series: [
        {
          name: columnName,
          type: "column",
          data: currColumnData,
        },
        {
          name: lineName,
          type: "line",
          data: currLineData,
        },
      ],
      chart: {
        height: 350,
        type: "line",
        toolbar: { show: false },
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: title,
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

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [columnData, lineData, columnName, lineName, title, labels]);

  return (
    <div>
      {/* Title and Description */}
      <Typography
        variant="h6"
        style={{ textAlign: "center", marginBottom: 10 }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        style={{ textAlign: "center", marginBottom: 20 }}
      >
        {description}
      </Typography>
      ƒ
      <div ref={chartRef} id="line-column-chart" />
    </div>
  );
};

export default LineColumnChartTemplate;
