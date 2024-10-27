import { BarChartTemplate } from "../ChartTemplates/BarChartTemplates/BarChartTemplate";
import { HorizontalBarChartTemplate } from "../ChartTemplates/BarChartTemplates/HorizontalBarChartTemplate";
import { StackedGroupBarChartTemplate } from "../ChartTemplates/BarChartTemplates/StackGroupBarChartTemplate";
import { DonutChartTemplate } from "../ChartTemplates/PieChartTemplates/DonutChartTemplate";
import { AreaChartTemplate } from "../ChartTemplates/AreaChartTemplates/AreaChartTemplate";
import { PyramidBarChartTemplate } from "../ChartTemplates/BarChartTemplates/PyramidBarChartTemplate";
import LineColumnChartTemplate from "../ChartTemplates/LineChartTemplates/LineColumnChartTemplate";
import PieChartTemplate from "../ChartTemplates/PieChartTemplates/PieChartTemplate";
import RadarChartTemplate from "../ChartTemplates/RadarChartTemplates/RadarChartTemplate";
import RadarChartMultipleTemplate from "../ChartTemplates/RadarChartTemplates/RadarChartMultipleTemplate";
import RadarChartPolarTemplate from "../ChartTemplates/RadarChartTemplates/RadarChartPolarTemplate";
import ScatterChartTemplate from "../ChartTemplates/LineChartTemplates/ScatterChartTemplate";
import CandlestickTemplate from "../ChartTemplates/BoxPlotTemplates/CandleStickTemplate";
import BoxPlotTemplate from "../ChartTemplates/BoxPlotTemplates/BoxPlotTemplate";
import LineChartTemplate from "../ChartTemplates/LineChartTemplates/LineChartTemplate";
import TableTemplate from "../ChartTemplates/TableTemplate/TableTemplate";
import SingleValueTemplate from "../ChartTemplates/SingleValueTemplate/SingleValueTemplate";
export const componentMapping = {
  'LineChartTemplate': LineChartTemplate,
  'BarChartTemplate': BarChartTemplate,
  'HorizontalBarChartTemplate': HorizontalBarChartTemplate,
  'DonutChartTemplate': DonutChartTemplate,
  'AreaChartTemplate': AreaChartTemplate,
  'StackedGroupBarChartTemplate': StackedGroupBarChartTemplate,
  'PyramidBarChartTemplate': PyramidBarChartTemplate,
  'LineColumnChartTemplate': LineColumnChartTemplate,
  'PieChartTemplate': PieChartTemplate,
  'RadarChartTemplate': RadarChartTemplate,
  'RadarChartMultipleTemplate': RadarChartMultipleTemplate,
  'RadarChartPolarTemplate': RadarChartPolarTemplate,
  'ScatterChartTemplate': ScatterChartTemplate,
  'CandlestickTemplate': CandlestickTemplate,
  'BoxPlotTemplate': BoxPlotTemplate,
  'TableTemplate': TableTemplate,
  'SingleValueTemplate': SingleValueTemplate,
}

export const componentNames = {
  'Line Chart': 'LineChartTemplate',
  'Bar Chart': 'BarChartTemplate',
  'Horizontal Bar Chart': 'HorizontalBarChartTemplate',
  'Donut Chart': 'DonutChartTemplate',
  'Area Chart': 'AreaChartTemplate',
  'Stacked Group Bar Chart': 'StackedGroupBarChartTemplate',
  'Pyramid Bar Chart': 'PyramidBarChartTemplate',
  'Line Column Chart': 'LineColumnChartTemplate',
  'Pie Chart': 'PieChartTemplate',
  'Radar Chart': 'RadarChartTemplate',
  'Radar Chart Multiple': 'RadarChartMultipleTemplate',
  'Radar Chart Polar': 'RadarChartPolarTemplate',
  'Scatter Chart': 'ScatterChartTemplate',
  'Candlestick Chart': 'CandlestickTemplate',
  'Box Plot Chart': 'BoxPlotTemplate',
  'Table': 'TableTemplate',
  'Single Value': 'SingleValueTemplate',
}
