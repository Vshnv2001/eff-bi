import BarGroupChartTemplate from "../../Templates/BarChartTemplates/BarGroupChartTemplate";

const BarGroupChart = () => {
    const chartWidth = 400;
    const chartHeight = 400;
  return (
    <div>
      <BarGroupChartTemplate width={chartWidth} height={chartHeight} events={true} />
    </div>
  )
}

export default BarGroupChart