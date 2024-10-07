import RadialBarTemplate from "../../Templates/BarChartTemplates/RadialBarTemplate";

const RadialBarChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return (
    <div>
      <RadialBarTemplate width={chartWidth} height={chartHeight} />
    </div>
  );
};

export default RadialBarChart;
