import { BarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/BarChartTemplate";
import { HorizontalBarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/HorizontalBarChartTemplate";
import { StackedGroupBarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/StackGroupBarChartTemplate";
import { DonutChartTemplate } from "../components/ChartTemplates/PieChartTemplates/DonutChartTemplate";
import { AreaChartTemplate } from "../components/ChartTemplates/AreaChartTemplates/AreaChartTemplate";
import { PyramidBarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/PyramidBarChartTemplate";
import LineColumnChartTemplate from "../components/ChartTemplates/LineChartTemplates/LineColumnChartTemplate";
import MultipleYAxisLineChartTemplate from "../components/ChartTemplates/LineChartTemplates/MultipleYAxisLineChartTemplate";
import PieChartTemplate from "../components/ChartTemplates/PieChartTemplates/PieChartTemplate";
import RadarChartTemplate from "../components/ChartTemplates/RadarChartTemplates/RadarChartTemplate";

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

  // Mock data for Line Column Chart
  const columnData = [
    440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160,
  ];

  const lineData = [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16];

  const labels = [
    "01 Jan 2001",
    "02 Jan 2001",
    "03 Jan 2001",
    "04 Jan 2001",
    "05 Jan 2001",
    "06 Jan 2001",
    "07 Jan 2001",
    "08 Jan 2001",
    "09 Jan 2001",
    "10 Jan 2001",
    "11 Jan 2001",
    "12 Jan 2001",
  ];

  // Mock data for Multiple Y Axis Line Chart
  const incomeData = [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6];
  const cashflowData = [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5];
  const revenueData = [20, 29, 37, 36, 44, 45, 50, 58];
  const categories = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];

  // Mock data for Pie Chart
  const pieChartSeriesData = [44, 55, 13, 43, 22];
  const pieChartLabelsData = ["Team A", "Team B", "Team C", "Team D", "Team E"];

  // Mock data for Radar Chart
  const radarChartSeriesData = [
    {
      name: "Series 1",
      data: [80, 50, 30, 40, 100, 20],
    },
  ];
  const radarChartCategoriesData = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
  ];

  return (
    <div>
      <BarChartTemplate
        chartSeries={chartSeriesBar}
        categories={categoriesBar}
      />

      <HorizontalBarChartTemplate
        chartSeries={chartSeriesBar}
        categories={categoriesBar}
      />

      <DonutChartTemplate
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

      <LineColumnChartTemplate
        columnData={columnData}
        lineData={lineData}
        labels={labels}
        columnName="Website Blog"
        lineName="Social Media"
        chartTitle="Traffic Sources"
      />

      <MultipleYAxisLineChartTemplate
        incomeData={incomeData}
        cashflowData={cashflowData}
        revenueData={revenueData}
        categories={categories}
        chartTitle="XYZ - Stock Analysis (2009 - 2016)"
      />

      <PieChartTemplate
        series={pieChartSeriesData}
        labels={pieChartLabelsData}
        chartWidth={380}
      />

      <RadarChartTemplate
        series={radarChartSeriesData}
        categories={radarChartCategoriesData}
        chartHeight={350}
      />
    </div>
  );
}
