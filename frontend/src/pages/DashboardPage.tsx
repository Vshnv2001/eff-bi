import { BarChartTemplate } from "./ChartTemplates/BarChartTemplate";
import { PieChartTemplate } from "./ChartTemplates/PieChartTemplate";
import { AreaChartTemplate } from "./ChartTemplates/AreaChartTemplate";

export default function Page(): React.JSX.Element {
  return (
    <div>
      <BarChartTemplate
        chartSeries={[
          { name: "Toyota", data: [10, 20, 30, 40, 50, 60] },
          { name: "Honda", data: [15, 25, 35, 10, 20, 30] },
          { name: "Hyundai", data: [15, 25, 35, 10, 20, 30] },
          { name: "Mitsubishi", data: [15, 25, 35, 10, 20, 30] },
          { name: "Tesla", data: [15, 25, 35, 10, 20, 30] },
        ]}
        categories={["Jan", "Feb", "Mar", "April", "May", "June"]}
      />
      <PieChartTemplate
        chartSeries={[10, 10, 10, 10, 10]}
        labels={["A", "B", "C", "D", "E"]}
        sx={{ height: "100%" }}
      />

      <AreaChartTemplate
        chartSeries={[{ name: "STOCK ABC", data: [10, 20, 15, 30, 25] }]}
        labels={[
          "2024-01-01",
          "2024-02-01",
          "2024-03-01",
          "2024-04-01",
          "2024-05-01",
        ]}
      />
    </div>
  );
}
