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
  boxPlotData,
} from "../components/ChartTemplates/MockData/mockData";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Tooltip,
} from "@mui/material";

const chartComponents = [
  {
    component: LineChartTemplate,
    props: {
      series: lineChartSeries,
      title: "Product Trends by Month",
      categories: lineChartCategories,
      height: 350,
    },
  },
  {
    component: BarChartTemplate,
    props: { chartSeries: chartSeriesBar, categories: categoriesBar },
  },
  {
    component: HorizontalBarChartTemplate,
    props: { chartSeries: chartSeriesBar, categories: categoriesBar },
  },
  {
    component: DonutChartTemplate,
    props: {
      chartSeries: pieChartSeries,
      labels: pieChartLabels,
      sx: { height: "100%" },
    },
  },
  {
    component: AreaChartTemplate,
    props: { chartSeries: areaChartSeries, labels: areaChartLabels },
  },
  {
    component: StackedGroupBarChartTemplate,
    props: {
      chartSeries: chartSeriesStacked,
      categories: categoriesStacked,
      sx: { width: "100%", maxWidth: 600, margin: "0 auto" },
    },
  },
  {
    component: PyramidBarChartTemplate,
    props: {
      chartSeries: chartSeriesPyramid,
      categories: categoriesPyramid,
      sx: { maxWidth: 600, margin: "auto" },
    },
  },
  {
    component: LineColumnChartTemplate,
    props: {
      columnData,
      lineData,
      labels,
      columnName: "Website Blog",
      lineName: "Social Media",
      chartTitle: "Traffic Sources",
    },
  },
  {
    component: MultipleYAxisLineChartTemplate,
    props: {
      incomeData,
      cashflowData,
      revenueData,
      categories,
      chartTitle: "XYZ - Stock Analysis (2009 - 2016)",
    },
  },
  {
    component: PieChartTemplate,
    props: {
      series: pieChartSeriesData,
      labels: pieChartLabelsData,
      chartWidth: 380,
    },
  },
  {
    component: RadarChartTemplate,
    props: {
      series: radarChartSeriesData,
      categories: radarChartCategoriesData,
      chartHeight: 350,
    },
  },
  {
    component: RadarChartMultipleTemplate,
    props: {
      series: radarChartMultipleSeriesData,
      categories: radarChartMultipleCategoriesData,
      chartHeight: 350,
    },
  },
  {
    component: RadarChartPolarTemplate,
    props: { series: radarPolarSeriesData, chartWidth: 380 },
  },
  {
    component: ScatterChartTemplate,
    props: { series: scatterChartSeriesData, chartHeight: 350 },
  },
  {
    component: CandlestickTemplate,
    props: {
      data: candleStickData,
      title: "Bitcoin Candlestick Chart",
      height: 400,
    },
  },
  {
    component: BoxPlotTemplate,
    props: { data: boxPlotData, title: "Dynamic BoxPlot Chart", height: 400 },
  },
];

export default function Page(): React.JSX.Element {
    return (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Product Trends by Month</Typography>
                <LineChartTemplate
                  title={"Hello"}
                  series={lineChartSeries}
                  categories={lineChartCategories}
                  height={350}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Bar Chart</Typography>
                <BarChartTemplate
                  chartSeries={chartSeriesBar}
                  categories={categoriesBar}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Horizontal Bar Chart</Typography>
                <HorizontalBarChartTemplate
                  chartSeries={chartSeriesBar}
                  categories={categoriesBar}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Donut Chart</Typography>
                <DonutChartTemplate
                  chartSeries={pieChartSeries}
                  labels={pieChartLabels}
                  sx={{ height: "100%" }}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Area Chart</Typography>
                <AreaChartTemplate
                  chartSeries={areaChartSeries}
                  labels={areaChartLabels}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Stacked Group Bar Chart</Typography>
                <StackedGroupBarChartTemplate
                  chartSeries={chartSeriesStacked}
                  categories={categoriesStacked}
                  sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Pyramid Bar Chart</Typography>
                <PyramidBarChartTemplate
                  chartSeries={chartSeriesPyramid}
                  categories={categoriesPyramid}
                  sx={{ maxWidth: 600, margin: "auto" }}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Line Column Chart</Typography>
                <LineColumnChartTemplate
                  columnData={columnData}
                  lineData={lineData}
                  labels={labels}
                  columnName="Website Blog"
                  lineName="Social Media"
                  chartTitle="Traffic Sources"
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Multiple Y-Axis Line Chart</Typography>
                <MultipleYAxisLineChartTemplate
                  incomeData={incomeData}
                  cashflowData={cashflowData}
                  revenueData={revenueData}
                  categories={categories}
                  chartTitle="XYZ - Stock Analysis (2009 - 2016)"
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Pie Chart</Typography>
                <PieChartTemplate
                  series={pieChartSeriesData}
                  labels={pieChartLabelsData}
                  chartWidth={380}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Radar Chart</Typography>
                <RadarChartTemplate
                  series={radarChartSeriesData}
                  categories={radarChartCategoriesData}
                  chartHeight={350}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Radar Chart Multiple</Typography>
                <RadarChartMultipleTemplate
                  series={radarChartMultipleSeriesData}
                  categories={radarChartMultipleCategoriesData}
                  chartHeight={350}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Radar Polar Chart</Typography>
                <RadarChartPolarTemplate
                  series={radarPolarSeriesData}
                  chartWidth={380}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Scatter Chart</Typography>
                <ScatterChartTemplate
                  series={scatterChartSeriesData}
                  chartHeight={350}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Candlestick Chart</Typography>
                <CandlestickTemplate
                  data={candleStickData}
                  title="Bitcoin Candlestick Chart"
                  height={400}
                />
              </CardContent>
            </Card>
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Box Plot Chart</Typography>
                <BoxPlotTemplate
                  data={boxPlotData}
                  title="Dynamic BoxPlot Chart"
                  height={400}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
}
