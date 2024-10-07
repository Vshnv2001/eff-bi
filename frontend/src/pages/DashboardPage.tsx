import { BarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/BarChartTemplate";
import { HorizontalBarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/HorizontalBarChartTemplate";
import { StackedGroupBarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/StackGroupBarChartTemplate";
import { PieChartTemplate } from "../components/ChartTemplates/PieChartTemplates/PieChartTemplate";
import { AreaChartTemplate } from "../components/ChartTemplates/AreaChartTemplates/AreaChartTemplate";
import { PyramidBarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/PyramidBarChartTemplate";

export default function Page(): React.JSX.Element {
  // Mock data for Pyramid Bar Chart
  const chartSeriesPyramid = [
    { name: "Age 0-14", data: [-20, -30, -25, -40] },
    { name: "Age 15-64", data: [50, 70, 60, 80] },
  ];
  const categoriesPyramid = ["2011", "2021", "2031", "2041"];

  // Mock data for Stacked Group Bar Chart
  const chartSeriesStacked = [
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
  const categoriesStacked = [
    "Online advertising",
    "Sales Training",
    "Print advertising",
    "Catalogs",
    "Meetings",
  ];

  // Mock data for Bar Chart
  const chartSeriesBar = [
    { name: "Toyota", data: [10, 20, 30, 40, 50, 60] },
    { name: "Honda", data: [15, 25, 35, 10, 20, 30] },
    { name: "Hyundai", data: [15, 25, 35, 10, 20, 30] },
    { name: "Mitsubishi", data: [15, 25, 35, 10, 20, 30] },
    { name: "Tesla", data: [15, 25, 35, 10, 20, 30] },
  ];
  const categoriesBar = ["Jan", "Feb", "Mar", "April", "May", "June"];

  // Mock data for Pie Chart
  const pieChartSeries = [10, 10, 10, 10, 10];
  const pieChartLabels = ["A", "B", "C", "D", "E"];

  // Mock data for Area Chart
  const areaChartSeries = [{ name: "STOCK ABC", data: [10, 20, 15, 30, 25] }];
  const areaChartLabels = [
    "2024-01-01",
    "2024-02-01",
    "2024-03-01",
    "2024-04-01",
    "2024-05-01",
  ];

  return (
    <div>
      <BarChartTemplate chartSeries={chartSeriesBar} categories={categoriesBar} />

      <HorizontalBarChartTemplate
        chartSeries={chartSeriesBar}
        categories={categoriesBar}
      />

      <PieChartTemplate
        chartSeries={pieChartSeries}
        labels={pieChartLabels}
        sx={{ height: "100%" }}
      />

      <AreaChartTemplate
        chartSeries={areaChartSeries}
        labels={areaChartLabels}
      />

      <StackedGroupBarChartTemplate
        chartSeries={chartSeriesStacked}
        categories={categoriesStacked}
        sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}
      />

      <PyramidBarChartTemplate
        chartSeries={chartSeriesPyramid}
        categories={categoriesPyramid}
        sx={{ maxWidth: 600, margin: "auto" }}
      />
    </div>
  );
}