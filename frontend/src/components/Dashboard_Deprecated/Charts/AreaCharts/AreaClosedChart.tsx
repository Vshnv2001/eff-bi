import AreaClosedTemplate from "../../Templates/AreaChartTemplates/AreaClosedTemplate";

const AreaClosedChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return (
    <div>
      <AreaClosedTemplate width={chartWidth} height={chartHeight} />
    </div>
  );
};

export default AreaClosedChart;