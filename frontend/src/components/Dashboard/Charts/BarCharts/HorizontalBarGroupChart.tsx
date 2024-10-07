import HorizontalBarGroupChartTemplate from "../../Templates/BarChartTemplates/HorizontalBarGroupChartTemplate";

const HorizontalBarGroupChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return (
    <div>
      <HorizontalBarGroupChartTemplate
        width={chartWidth}
        height={chartHeight}
        events={true}
      />
    </div>
  );
};

export default HorizontalBarGroupChart;
