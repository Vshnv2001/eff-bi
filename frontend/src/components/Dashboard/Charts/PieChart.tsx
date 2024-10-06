import PieChartTemplate from "../Templates/PieChartTemplate";

const PieChart = () => {
  const chartWidth = 400;
  const chartHeight = 400;
  const data = [
    { label: "A", value: 10 },
    { label: "B", value: 10 },
    { label: "C", value: 10 },
    { label: "D", value: 10 },
    { label: "E", value: 10 },
    { label: "F", value: 10 },
    { label: "G", value: 10 },
    { label: "H", value: 10 },
  ];

  return (
    <div>
      <PieChartTemplate width={chartWidth} height={chartHeight} data={data} />
    </div>
  );
};

export default PieChart;