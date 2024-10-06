import AreaClosedTemplate from "../Templates/AreaClosedTemplate";

const AreaClosed = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  return (
    <div>
      <AreaClosedTemplate width={chartWidth} height={chartHeight}/>
    </div>
  );
};

export default AreaClosed;
