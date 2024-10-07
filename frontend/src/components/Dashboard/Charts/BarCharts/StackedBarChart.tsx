import StackedBarChartTemplate from "../../Templates/BarChartTemplates/StackedBarChartTemplate";

const StackedBarChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return <div>
    <StackedBarChartTemplate width={chartWidth} height={chartHeight} />
  </div>;
};

export default StackedBarChart;