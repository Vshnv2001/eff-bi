import HorizontalStackedBarChartTemplate from "../../Templates/BarChartTemplates/HorizontalStackedBarChartTemplate";

const HorizontalStackedBarChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return <div>
    <HorizontalStackedBarChartTemplate width={chartWidth} height={chartHeight} />
  </div>;
};

export default HorizontalStackedBarChart;