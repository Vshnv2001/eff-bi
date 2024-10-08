// Mock data for Pyramid Bar Chart
export const chartSeriesPyramid = [
  { name: "Age 0-14", data: [-20, -30, -25, -40] },
  { name: "Age 15-64", data: [50, 70, 60, 80] },
];
export const categoriesPyramid = ["2011", "2021", "2031", "2041"];

// Mock data for Stacked Group Bar Chart
export const chartSeriesStacked = [
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
export const categoriesStacked = [
  "Online advertising",
  "Sales Training",
  "Print advertising",
  "Catalogs",
  "Meetings",
];


// Mock data for Bar Chart
export const chartSeriesBar = [
  { name: "Toyota", data: [10, 20, 30, 40, 50, 60] },
  { name: "Honda", data: [15, 25, 35, 10, 20, 30] },
  { name: "Hyundai", data: [15, 25, 35, 10, 20, 30] },
  { name: "Mitsubishi", data: [15, 25, 35, 10, 20, 30] },
  { name: "Tesla", data: [15, 25, 35, 10, 20, 30] },
];
export const categoriesBar = ["Jan", "Feb", "Mar", "April", "May", "June"];

// Mock data for Pie Chart
export const pieChartSeries = [10, 10, 10, 10, 10];
export const pieChartLabels = ["A", "B", "C", "D", "E"];

// Mock data for Area Chart
export const areaChartSeries = [{ name: "STOCK ABC", data: [10, 20, 15, 30, 25] }];
export const areaChartLabels = [
  "2024-01-01",
  "2024-02-01",
  "2024-03-01",
  "2024-04-01",
  "2024-05-01",
];

// Mock data for Line Column Chart
export const columnData = [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160];

export const lineData = [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16];

export const labels = [
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
export const incomeData = [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6];
export const cashflowData = [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5];
export const revenueData = [20, 29, 37, 36, 44, 45, 50, 58];
export const categories = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];

// Mock data for Pie Chart
export const pieChartSeriesData = [44, 55, 13, 43, 22];
export const pieChartLabelsData = ["Team A", "Team B", "Team C", "Team D", "Team E"];

// Mock data for Radar Chart
export const radarChartSeriesData = [
  {
    name: "Series 1",
    data: [80, 50, 30, 40, 100, 20],
  },
];
export const radarChartCategoriesData = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
];

// Mock data for Radar Multiple Chart
export const radarChartMultipleSeriesData = [
  {
    name: "Series 1",
    data: [80, 50, 30, 40, 100, 20],
  },
  {
    name: "Series 2",
    data: [20, 30, 40, 80, 20, 80],
  },
  {
    name: "Series 3",
    data: [44, 76, 78, 13, 43, 10],
  },
];

export const radarChartMultipleCategoriesData = [
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
];

// Mock data for Radar Polar Chart
export const radarPolarSeriesData = [14, 23, 21, 17, 15, 10, 12, 17, 21];

// Mock data for Scatter Chart
export const scatterChartSeriesData: {
  name: string;
  data: [number, number][];
}[] = [
  {
    name: "SAMPLE A",
    data: [
      [16.4, 5.4],
      [21.7, 2],
      [25.4, 3],
      [19, 2],
      [10.9, 1],
      [13.6, 3.2],
      [10.9, 7.4],
      [10.9, 0],
      [10.9, 8.2],
      [16.4, 0],
      [16.4, 1.8],
      [13.6, 0.3],
      [13.6, 0],
      [29.9, 0],
      [27.1, 2.3],
      [16.4, 0],
      [13.6, 3.7],
      [10.9, 5.2],
      [16.4, 6.5],
      [10.9, 0],
      [24.5, 7.1],
      [10.9, 0],
      [8.1, 4.7],
      [19, 0],
      [21.7, 1.8],
      [27.1, 0],
      [24.5, 0],
      [27.1, 0],
      [29.9, 1.5],
      [27.1, 0.8],
      [22.1, 2],
    ],
  },
  {
    name: "SAMPLE B",
    data: [
      [36.4, 13.4],
      [1.7, 11],
      [5.4, 8],
      [9, 17],
      [1.9, 4],
      [3.6, 12.2],
      [1.9, 14.4],
      [1.9, 9],
      [1.9, 13.2],
      [1.4, 7],
      [6.4, 8.8],
      [3.6, 4.3],
      [1.6, 10],
      [9.9, 2],
      [7.1, 15],
      [1.4, 0],
      [3.6, 13.7],
      [1.9, 15.2],
      [6.4, 16.5],
      [0.9, 10],
      [4.5, 17.1],
      [10.9, 10],
      [0.1, 14.7],
      [9, 10],
      [12.7, 11.8],
      [2.1, 10],
      [2.5, 10],
      [27.1, 10],
      [2.9, 11.5],
      [7.1, 10.8],
      [2.1, 12],
    ],
  },
  {
    name: "SAMPLE C",
    data: [
      [21.7, 3],
      [23.6, 3.5],
      [24.6, 3],
      [29.9, 3],
      [21.7, 20],
      [23, 2],
      [10.9, 3],
      [28, 4],
      [27.1, 0.3],
      [16.4, 4],
      [13.6, 0],
      [19, 5],
      [22.4, 3],
      [24.5, 3],
      [32.6, 3],
      [27.1, 4],
      [29.6, 6],
      [31.6, 8],
      [21.6, 5],
      [20.9, 4],
      [22.4, 0],
      [32.6, 10.3],
      [29.7, 20.8],
      [24.5, 0.8],
      [21.4, 0],
      [21.7, 6.9],
      [28.6, 7.7],
      [15.4, 0],
      [18.1, 0],
      [33.4, 0],
      [16.4, 0],
    ],
  },
];

// Mock data for candle stick chart
export const candleStickData: {
  x: Date | number;
  y: [number, number, number, number];
}[] = [
  {
    x: new Date(1538778600000),
    y: [6629.81, 6650.5, 6623.04, 6633.33],
  },
  {
    x: new Date(1538780400000),
    y: [6632.01, 6643.59, 6620, 6630.11],
  },
  {
    x: new Date(1538782200000),
    y: [6630.71, 6648.95, 6623.34, 6635.65],
  },
  {
    x: new Date(1538784000000),
    y: [6635.65, 6651, 6629.67, 6638.24],
  },
  {
    x: new Date(1538785800000),
    y: [6638.24, 6640, 6620, 6624.47],
  },
  {
    x: new Date(1538787600000),
    y: [6624.53, 6636.03, 6621.68, 6624.31],
  },
  {
    x: new Date(1538789400000),
    y: [6624.61, 6632.2, 6617, 6626.02],
  },
  {
    x: new Date(1538791200000),
    y: [6627, 6627.62, 6584.22, 6603.02],
  },
  {
    x: new Date(1538793000000),
    y: [6605, 6608.03, 6598.95, 6604.01],
  },
  {
    x: new Date(1538794800000),
    y: [6604.5, 6614.4, 6602.26, 6608.02],
  },
  {
    x: new Date(1538796600000),
    y: [6608.02, 6610.68, 6601.99, 6608.91],
  },
  {
    x: new Date(1538798400000),
    y: [6608.91, 6618.99, 6608.01, 6612],
  },
  {
    x: new Date(1538800200000),
    y: [6612, 6615.13, 6605.09, 6612],
  },
  {
    x: new Date(1538802000000),
    y: [6612, 6624.12, 6608.43, 6622.95],
  },
];

// Mock data for box plot chart
type BoxPlotDataPoint = {
  x: string;
  y: [number, number, number, number, number];
};

export const boxPlotData: BoxPlotDataPoint[] = [
  { x: "Jan 2015", y: [54, 66, 69, 75, 88] },
  { x: "Jan 2016", y: [43, 65, 69, 76, 81] },
  { x: "Jan 2017", y: [31, 39, 45, 51, 59] },
  { x: "Jan 2018", y: [39, 46, 55, 65, 71] },
  { x: "Jan 2019", y: [29, 31, 35, 39, 44] },
  { x: "Jan 2020", y: [41, 49, 58, 61, 67] },
  { x: "Jan 2021", y: [54, 59, 66, 71, 88] },
];

// Mock data for line chart
export const lineChartSeries = [
  {
    name: "Desktops",
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
  },
];

export const lineChartCategories = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
];
