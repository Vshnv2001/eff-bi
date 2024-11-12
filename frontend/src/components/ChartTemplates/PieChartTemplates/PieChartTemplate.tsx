import * as React from "react";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { ApexOptions } from "apexcharts";
import { Chart } from "../Chart";
import CardContent from "@mui/material/CardContent";

interface PieChartTemplateProps {
  series: number[];
  labels: string[];
  title: string;
  description: string;
}

export function PieChartTemplate({
  series,
  labels,
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
      type: "pie",
      height: "100%",
      sparkline: {
        enabled: false,
      },
    },
    labels: labels,
    plotOptions: {
      pie: {
        customScale: 1,
      },
    },
    colors: generateColors(series.length),
    legend: {
      position: "right",
      fontSize: fontSize,
      show: true,
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
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Typography variant="h6" style={{ textAlign: "center", marginBottom: 8 }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        style={{ textAlign: "center", marginBottom: 16 }}
      >
        {description}
      </Typography>
      <CardContent
        style={{ width: "100%", height: "calc(100% - 40px)", padding: 0 }}
      >
        {series.length === 0 ? (
          <Typography
            variant="body2"
            style={{ textAlign: "center", marginTop: 20, color: "red" }}
          >
            Query returned empty result, so no visualization needed.
          </Typography>
        ) : (
          <Chart
            options={chartOptions}
            series={series}
            type="pie"
            width="100%"
            height="100%"
          />
        )}
      </CardContent>
      <Divider />
    </div>
  );
}

export default PieChartTemplate;
