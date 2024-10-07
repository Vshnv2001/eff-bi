import LineChartTemplate from "../../Templates/LineChartTemplates/LineChartTemplate";

const LineChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return (
    <div>
      <LineChartTemplate width={chartWidth} height={chartHeight} />
    </div>
  );
};

export default LineChart;
