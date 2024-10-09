import { BarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/BarChartTemplate";
import { HorizontalBarChartTemplate } from "../components/ChartTemplates/BarChartTemplates/HorizontalBarChartTemplate";
import LineChartTemplate from "../components/ChartTemplates/LineChartTemplates/LineChartTemplate";
import { lineChartSeries, lineChartCategories, chartSeriesBar, categoriesBar } from "../components/ChartTemplates/MockData/mockData";

export const components = {
    'lineChartTemplate' : {
      component: LineChartTemplate,
      props: {
        series: lineChartSeries,
        title: "Product Trends by Month",
        categories: lineChartCategories,
        height: 350,
      },
    },
    'barChartTemplate' : {
      component: BarChartTemplate,
      props: { chartSeries: chartSeriesBar, categories: categoriesBar },
    },
    'horizontalBarChartTemplate' : {
      component: HorizontalBarChartTemplate,
      props: { chartSeries: chartSeriesBar, categories: categoriesBar },
    },
    
  }