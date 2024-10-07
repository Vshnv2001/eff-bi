import OuterPieChartTemplate from "../../Templates/PieChartTemplates/OuterPieChartTemplate";

const OuterPieChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return (
    <div>
      <OuterPieChartTemplate width={chartWidth} height={chartHeight} />
    </div>
  );
};

export default OuterPieChart;
