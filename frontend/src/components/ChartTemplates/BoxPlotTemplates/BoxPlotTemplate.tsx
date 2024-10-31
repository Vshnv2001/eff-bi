import React, { useEffect } from "react";
import ApexCharts from "apexcharts";
import { Typography } from "@mui/material";

type BoxPlotData = {
  x: string;
  y: number[];
};

type BoxPlotTemplateProps = {
  data: BoxPlotData[];
  height?: number;
  title?: string;
  description?: string;
  id: number;
};

const BoxPlotTemplate: React.FC<BoxPlotTemplateProps> = ({
  data,
  height = 350,
  title,
  description,
  id,
}) => {

  useEffect(() => {
    const options = {
      series: [
        {
          type: "boxPlot",
          data: data,
        },
      ],
      chart: {
        type: "boxPlot",
        height: height,
        toolbar: { show: false },
      },
      plotOptions: {
        boxPlot: {
          colors: {
            upper: "#5C4742",
            lower: "#A5978B",
          },
        },
      },
    };

    const chart = new ApexCharts(
      document.querySelector("#boxplot-chart"),
      options
    );
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data, height]);

  return (
    <div>
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

      <div id="boxplot-chart" />
    </div>
  );
};

export default BoxPlotTemplate;
