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
import RadarChartMultipleTemplate from "../components/ChartTemplates/RadarChartTemplates/RadarChartMultipleTemplate";
import RadarChartPolarTemplate from "../components/ChartTemplates/RadarChartTemplates/RadarChartPolarTemplate";
import ScatterChartTemplate from "../components/ChartTemplates/LineChartTemplates/ScatterChartTemplate";
import CandlestickTemplate from "../components/ChartTemplates/BoxPlotTemplates/CandleStickTemplate";
import BoxPlotTemplate from "../components/ChartTemplates/BoxPlotTemplates/BoxPlotTemplate";
import LineChartTemplate from "../components/ChartTemplates/LineChartTemplates/LineChartTemplate";

import {
    chartSeriesPyramid,
    categoriesPyramid,
    chartSeriesStacked,
    categoriesStacked,
    chartSeriesBar,
    categoriesBar,
    pieChartSeries,
    pieChartLabels,
    areaChartSeries,
    areaChartLabels,
    columnData,
    lineData,
    labels,
    incomeData,
    cashflowData,
    revenueData,
    categories,
    pieChartSeriesData,
    pieChartLabelsData,
    radarChartSeriesData,
    radarChartCategoriesData,
    radarChartMultipleSeriesData,
    radarChartMultipleCategoriesData,
    radarPolarSeriesData,
    scatterChartSeriesData,
    candleStickData,
    lineChartSeries,
    lineChartCategories,
    boxPlotData
  } from "../components/ChartTemplates/MockData/mockData";

export default function Page(): React.JSX.Element {
  return (
    <div>
      <LineChartTemplate
        series={lineChartSeries}
        title="Product Trends by Month"
        categories={lineChartCategories}
        height={350}
      />

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
      <RadarChartMultipleTemplate
        series={radarChartMultipleSeriesData}
        categories={radarChartMultipleCategoriesData}
        chartHeight={350}
      />
      <RadarChartPolarTemplate series={radarPolarSeriesData} chartWidth={380} />
      <ScatterChartTemplate series={scatterChartSeriesData} chartHeight={350} />
      <CandlestickTemplate
        data={candleStickData}
        title="Bitcoin Candlestick Chart"
        height={400}
      />

      <BoxPlotTemplate
        data={boxPlotData}
        title="Dynamic BoxPlot Chart"
        height={400}
      />
    </div>
  );
}
