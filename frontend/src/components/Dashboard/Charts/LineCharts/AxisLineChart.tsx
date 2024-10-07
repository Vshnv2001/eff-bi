import AxisLineChartTemplate from "../../Templates/LineChartTemplates/AxisLineChartTemplate";

const AxisLineChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return (
    <div>
      <AxisLineChartTemplate width={chartWidth} height={chartHeight} />
    </div>
  );
};

export default AxisLineChart;
