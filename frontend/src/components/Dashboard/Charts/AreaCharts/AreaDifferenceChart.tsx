import AreaDifferenceTemplate from "../../Templates/AreaChartTemplates/AreaDifferenceTemplate";

const AreaDifferenceChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return (
    <div>
      <AreaDifferenceTemplate width={chartWidth} height={chartHeight} />
    </div>
  );
};

export default AreaDifferenceChart;
