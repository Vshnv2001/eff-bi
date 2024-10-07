import { BarChartTemplate } from "./ChartTemplates/BarChartTemplate";
import { PieChartTemplate } from "./ChartTemplates/PieChartTemplate";

export default function Page(): React.JSX.Element {
  return (
    <div>
      <BarChartTemplate
        chartSeries={[
          { name: "Product A", data: [10, 20, 30, 40, 50, 60] },
          { name: "Product B", data: [15, 25, 35, 10, 20, 30] },
          { name: "Product C", data: [15, 25, 35, 10, 20, 30] },
          { name: "Product D", data: [15, 25, 35, 10, 20, 30] },
          { name: "Product E", data: [15, 25, 35, 10, 20, 30] },
        ]}
        categories={["Jan", "Feb", "Mar", "April", "May", "June"]}
      />
      <PieChartTemplate
        chartSeries={[10, 10, 10, 10, 10]}
        labels={["Desktop", "Tablet", "Phone", "A", "b", "c"]}
        sx={{ height: "100%" }}
      />
    </div>
  );
}
