import { Chart } from "../Chart";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ApexOptions } from "apexcharts";

type BoxPlotData = {
  x: string;
  y: number[];
};

type BoxPlotTemplateProps = {
  data: BoxPlotData[];
  height?: number;
  title?: string;
  description?: string;
};

const BoxPlotTemplate: React.FC<BoxPlotTemplateProps> = ({
  data,
  height = 350,
  title,
  description,
}) => {
  const chartOptions = useChartOptions(height);

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

      <div>
        {data.length === 0 ? (
          <Typography
            variant="body1"
            style={{ textAlign: "center", color: "gray" }}
          >
            No data available for visualization.
          </Typography>
        ) : (
          <Chart
            height="100%"
            options={chartOptions}
            series={[{ type: "boxPlot", data }]}
            type="boxPlot"
            width="100%"
          />
        )}
      </div>
    </div>
  );
};

function useChartOptions(height: number): ApexOptions {
  const theme = useTheme();
  
  return {
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
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      title: {
        text: "Categories",
        style: { color: theme.palette.text.primary },
      },
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.secondary },
      },
    },
  };
}

export default BoxPlotTemplate;