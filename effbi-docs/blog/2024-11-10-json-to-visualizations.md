---
title: JSON Data to Visualizations
description: Summary of how we parse JSON data into relevant visualizations
slug: JSON Data to Visualizations
authors: [reyaaz]
hide_table_of_contents: false
---

## What Happens When the LLM Pipeline Successfully Outputs JSON Data?

EFF BI transforms JSON data into dynamic visualizations that are tailored to user queries. By using a flexible component mapping system, new visualizations can be easily integrated without altering the core structure. Let’s take a closer look at how this process works.

<!--truncate-->

### Step 1: Building Your Apex Chart

EFF BI utilizes ApexCharts, an open-source JavaScript charting library. With its wide range of customization options, you can modify details like tooltips, legends, and zoom options. If you wish to add your own chart types to EFF BI after cloning it, feel free to do so. You can explore the available chart types and learn more at [ApexCharts](https://apexcharts.com/).

### Step 2: Customize the Backend Component Mapping

Once you've created the specific chart component, the next step is to ensure the backend properly formats the data for your chart. Go to the `DataFormatter.py` folder and add the new chart type to the backend mapping. Here's how the format for AreaChart and LineChart looks:

```python
ChartType.AreaChartTemplate: {
    "chartSeries": [
        {"name": "", "data": []}
    ],
    "labels": []
},
ChartType.LineChartTemplate: {
    "series": [],
    "categories": [],
},
```

Be sure to add the new chart name and a use case to the prompt so the LLM knows when to select this new type of visualization for specific queries.

## Step 3: Customize the Frontend Component Mapping

On the frontend, we use a dynamic component mapping system to link chart types with their corresponding visualization components. This system is housed in the `ComponentMapping.tsx` file. The mapping is easy to follow and looks something like this:

```javascript
export const componentMapping = {
  LineChartTemplate: LineChartTemplate,
  BarChartTemplate: BarChartTemplate,
  AreaChartTemplate: AreaChartTemplate,
  PieChartTemplate: PieChartTemplate,
  RadarChartTemplate: RadarChartTemplate,
  ScatterChartTemplate: ScatterChartTemplate,
  CandlestickTemplate: CandlestickTemplate,
  BoxPlotTemplate: BoxPlotTemplate,
  TableTemplate: TableTemplate,
  SingleValueTemplate: SingleValueTemplate,
};
```

### Step 4: Voila, that's it

The beauty of EFF BI lies in its simplicity: adding a new chart is as easy as modifying the backend and frontend mappings without touching any core files. This approach follows the well-known Open-Closed Principle, which states that software should be open for extension but closed for modification.

As a result, the page displaying visualizations remains unchanged, even when new charts are added or removed. The visualization page works with a general superclass called PreviewComponent, and all specific chart components extend this parent class. This ensures smooth integration of new chart types without affecting the core structure.

### Extra: Streaming

EFF BI also supports SQL query streaming. While the chart type is being selected, verified, and the data is formatted, the SQL output is streamed to the frontend using Django's StreamingHTTPResponse in the backend. This means users can see the data being processed in real-time.

In the frontend, we use the fetch API to handle the streaming:

```javascript
const generateStream = async (
  description: string
): Promise<AsyncIterable<string>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 60000);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tile/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dash_id: dashboardId,
          title: tileName,
          description: description,
        }),
        signal: controller.signal,
      }
    );
    // code here hidden for brevity...
  } catch (error) {
    console.error("Error fetching stream:", error);
  }
};
```

Once the chart is generated, but while the SQL output is still streaming, the remaining sql data is displayed alongside the chart immediately, with no typewriting effect anymore.
The reason for streaming is to keep the user engaged, avoiding the dull experience of a simple loading bar. Streaming ensures users are aware of the process and feel connected to what EFF BI is doing in real-time.
You can adjust the chunk size to improve responsiveness or optimize the memory usage on smaller machines.

## Summing Up

With these simple steps, adding or modifying charts in EFF BI is a breeze. Whether you’re working with the backend or frontend, the process is seamless and scalable. Enjoy building and customizing your visualizations!