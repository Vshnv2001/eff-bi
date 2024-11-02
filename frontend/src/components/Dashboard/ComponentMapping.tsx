import { BarChartTemplate } from "../ChartTemplates/BarChartTemplates/BarChartTemplate";
import { HorizontalBarChartTemplate } from "../ChartTemplates/BarChartTemplates/HorizontalBarChartTemplate";
import { DonutChartTemplate } from "../ChartTemplates/PieChartTemplates/DonutChartTemplate";
import { AreaChartTemplate } from "../ChartTemplates/AreaChartTemplates/AreaChartTemplate";
import { PyramidBarChartTemplate } from "../ChartTemplates/BarChartTemplates/PyramidBarChartTemplate";
import PieChartTemplate from "../ChartTemplates/PieChartTemplates/PieChartTemplate";
import RadarChartTemplate from "../ChartTemplates/RadarChartTemplates/RadarChartTemplate";
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
  'PyramidBarChartTemplate': PyramidBarChartTemplate,
  'PieChartTemplate': PieChartTemplate,
  'RadarChartTemplate': RadarChartTemplate,
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
  'Pyramid Bar Chart': 'PyramidBarChartTemplate',
  'Pie Chart': 'PieChartTemplate',
  'Radar Chart': 'RadarChartTemplate',
  'Radar Chart Polar': 'RadarChartPolarTemplate',
  'Scatter Chart': 'ScatterChartTemplate',
  'Candlestick Chart': 'CandlestickTemplate',
  'Box Plot Chart': 'BoxPlotTemplate',
  'Table': 'TableTemplate',
  'Single Value': 'SingleValueTemplate',
}
