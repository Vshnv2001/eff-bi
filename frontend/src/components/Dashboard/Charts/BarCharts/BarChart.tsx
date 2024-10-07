import BarChartTemplate from "../../Templates/BarChartTemplates/BarChartTemplate";

const BarChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return (
    <div>
      <BarChartTemplate width={chartWidth} height={chartHeight} events={true} />
    </div>
  );
};

export default BarChart;
