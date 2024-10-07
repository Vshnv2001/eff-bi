import { BarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/BarChartTemplate";
import { HorizontalBarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/HorizontalBarChartTemplate";
import { StackedGroupBarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/StackGroupBarChartTemplate";
import { PieChartTemplate } from "../components/ChartTemplates/PieChartTemplate";
import { AreaChartTemplate } from "../components/ChartTemplates/AreaChartTemplate";

export default function Page(): React.JSX.Element {
  const chartSeries = [
    {
      name: "Q1 Budget",
      group: "budget",
      data: [44000, 55000, 41000, 67000, 22000],
    },
    {
      name: "Q1 Actual",
      group: "actual",
      data: [48000, 50000, 40000, 65000, 25000],
    },
    {
      name: "Q2 Budget",
      group: "budget",
      data: [13000, 36000, 20000, 8000, 13000],
    },
    {
      name: "Q2 Actual",
      group: "actual",
      data: [20000, 40000, 25000, 10000, 12000],
    },
  ];

  const categories = [
    "Online advertising",
    "Sales Training",
    "Print advertising",
    "Catalogs",
    "Meetings",
  ];

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

      <HorizontalBarChartTemplate
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

      <StackedGroupBarChartTemplate
        chartSeries={chartSeries}
        categories={categories}
        sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }} // Optional styling
      />
    </div>
  );
}
