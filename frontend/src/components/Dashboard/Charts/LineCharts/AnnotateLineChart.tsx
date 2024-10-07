import AnnotateLineChartTemplate from "../../Templates/AnnotateLineChartTemplate/AnnotateLineChartTemplate";

const AnnotateLineChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return <div>
    <AnnotateLineChartTemplate width={chartWidth} height={chartHeight} />
  </div>;
};

export default AnnotateLineChart;