import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent } from "@mui/material";
import FadeIn from "../Animations/FadeIn";

const Texts = [
  {
    title:
      "Show me the trend of the number of items purchased from day 1 to 10 as a line chart.",
    content:
      "This chart illustrates the fluctuation in the number of items purchased over the first ten days, highlighting trends and patterns in consumer behavior.",
  },
  {
    title:
      "Visualize the cumulative number of items purchased over the first ten days as a polar area chart.",
    content:
      "This polar area chart represents the distribution of items purchased across different categories, providing insights into consumer preferences over the first ten days.",
  },
  {
    title:
      "Compare the number of items purchased each day from day 1 to 10 using a bar chart.",
    content:
      "This bar chart provides a daily breakdown of the number of items purchased, making it easy to compare daily sales and identify peaks in consumer activity.",
  },
  {
    title:
      "Display the percentage distribution of total purchases for each item category in a donut chart.",
    content:
      "This donut chart highlights the share of total purchases made by Series 1 to Series 5, providing a clear view of how each series contributes to overall sales.",
  },
  {
    title:
      "Show the proportion of items purchased across Series 1 to Series 5 as a pie chart.",
    content:
      "This pie chart visually breaks down the total purchases made in Series 1 through Series 5, illustrating the percentage share of each series in the overall sales during the specified period.",
  },
];

const generateMockData = (length: number) => {
  return Array.from({ length }, (_, i) => ({
    x: i + 1,
    y: Math.floor(Math.random() * 100) + 1,
  }));
};

// Chart configurations
const charts = [
  { type: "line", title: "Line", data: [{ data: generateMockData(10) }] },
  {
    type: "polarArea",
    title: "Polar",
    data: generateMockData(5).map((item) => item.y + 10),
  },
  { type: "bar", title: "Bar", data: [{ data: generateMockData(10) }] },
  {
    type: "donut",
    title: "Donut",
    data: generateMockData(5).map((item) => item.y),
  },
  {
    type: "pie",
    title: "Pie",
    data: generateMockData(5).map((item) => item.y),
  },
];

const AboutUs: React.FC = () => {
  const [currentChart, setCurrentChart] = useState(charts[0]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScroll = () => {
    const centerY = window.innerHeight / 2;
    textRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        if (rect.top <= centerY && rect.bottom >= centerY) {
          setCurrentChart(charts[index]);
        }
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex w-full text-black bg-gradient-to-r from-red-100 to-blue-400">
      {/* Text Section */}
      <div className="w-1/2 p-16">
        <FadeIn>
          {Texts.map((text, index) => (
            <div
              key={index}
              ref={(el) => (textRefs.current[index] = el)}
              className="mb-6 h-[100vh] flex flex-col justify-center"
            >
              <h2 className="text-2xl font-bold">{text.title}</h2>
              <p>{text.content}</p>
            </div>
          ))}
        </FadeIn>
      </div>

      {/* Sticky Chart Section */}
      <div className="w-1/2 h-screen sticky top-0 flex items-center justify-center">
        <Card
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            height: "50%",
            boxShadow: 5,
          }}
        >
          <CardContent
            sx={{
              padding: "8px !important",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              "&:last-child": { paddingBottom: "8px" },
            }}
          >
            <ReactApexChart
              options={{
                chart: {
                  id: currentChart.title,
                  type: currentChart.type as any,
                  height: "100%",
                },
                title: {
                  text: currentChart.title,
                  align: "center",
                  style: {
                    fontSize: "12px",
                    fontWeight: "bold",
                  },
                },
                stroke: {
                  width: 1,
                },
              }}
              series={currentChart.data}
              type={currentChart.type as any}
              height="100%"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutUs;
