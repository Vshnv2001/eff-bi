import BoxPlotTemplate from "../Templates/BoxPlotTemplate";

const BoxPlot = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return (
    <div>
      <BoxPlotTemplate width={chartWidth} height={chartHeight} />
    </div>
  );
};

export default BoxPlot;