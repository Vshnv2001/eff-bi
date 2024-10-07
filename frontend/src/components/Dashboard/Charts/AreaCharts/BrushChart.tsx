import BrushChartTemplate from "../../Templates/AreaChartTemplates/BrushChartTemplate";

const BrushChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return (
    <div>
      <BrushChartTemplate width={chartWidth} height={chartHeight} />
    </div>
  );
};

export default BrushChart;
