import * as React from "react";
//import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { ApexOptions } from "apexcharts";
import { Chart } from "../Chart";

interface PieChartTemplateProps {
  series: number[];
  labels: string[];
  chartWidth?: number;
  title: string;
  description: string;
}

export function PieChartTemplate({
  series,
  labels,
  chartWidth,
  title,
  description,
}: PieChartTemplateProps): React.JSX.Element {
  const fontSize = series.length > 10 ? "12px" : "14px";

  const generateColors = (count: number): string[] => {
    const colors = [];
    const baseHue = 30;
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${(baseHue + (i * 360) / count) % 360}, 70%, 50%)`);
    }
    return colors;
  };

  const chartOptions: ApexOptions = {
    chart: {
      width: "100%",
      type: "pie",
    },
    labels: labels,
    colors: generateColors(series.length),
    responsive: [
      {
        breakpoint: 380,
        options: {
          chart: { width: chartWidth },
          legend: {
            height: 200,
          },
        },
      },
    ],
    legend: {
      position: "right",
      fontSize: fontSize,
      floating: true,
      formatter: function (seriesName, opts) {
        return seriesName + ` - ${series[opts.seriesIndex].toFixed(1)}`;
      },
      show: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `${value.toFixed(1)}%`,
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div style={{ position: "relative", marginTop: 0 }}>
      <Typography
        variant="h6"
        style={{ textAlign: "center", marginBottom: 0 }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        style={{ textAlign: "center", marginBottom: 0 }}
      >
        {description}
      </Typography>

      {series.length === 0 ? (
        <Typography
          variant="body2"
          style={{ textAlign: "center", marginTop: 20, color: "red" }}
        >
          Query returned empty result, so no visualization needed.
        </Typography>
      ) : (
        <Chart options={chartOptions} series={series} type="pie" width="100%" height="100%" />
      )}
      <Divider />
    </div>
  );
}

export default PieChartTemplate;
