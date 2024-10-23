"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ApexCharts from "apexcharts";
import type { ApexOptions } from "apexcharts";
import html2canvas from "html2canvas";
import { SxProps } from "@mui/material/styles";

export interface StackedBarChartProps {
  chartSeries: { name: string; group: string; data: number[] }[];
  categories: string[];
  sx?: SxProps;
}

export function StackedGroupBarChartTemplate({
  chartSeries,
  categories,
  sx,
}: StackedBarChartProps): React.JSX.Element {
  const chartOptions = useChartOptions(chartSeries, categories);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format: string) => {
    const chartElement = document.querySelector("#stacked-bar-chart") as HTMLElement;

    if (!chartElement) return;

    if (format === "SVG") {
      const svgData = chartElement.querySelector("svg");
      if (svgData) {
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svgData)], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "chart.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } else if (format === "PNG") {
      const canvas = await html2canvas(chartElement);
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "chart.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    }

    handleClose();
  };

  React.useEffect(() => {
    const chart = new ApexCharts(document.querySelector("#stacked-bar-chart"), chartOptions);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [chartOptions]);

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <div>
            <IconButton onClick={handleMenuClick} size="small">
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleDownload("SVG")}>
                Download as SVG
              </MenuItem>
              <MenuItem onClick={() => handleDownload("PNG")}>
                Download as PNG
              </MenuItem>
            </Menu>
          </div>
        }
      />
      <CardContent>
        <div id="stacked-bar-chart" />
      </CardContent>
      <Divider />
    </Card>
  );
}

function useChartOptions(
  chartSeries: { name: string; group: string; data: number[] }[], 
  categories: string[]
): ApexOptions {
  return {
    series: chartSeries,
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: { show: false },
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    dataLabels: {
      formatter: (val: number | string) => {
        return `${Number(val) / 1000}K`;
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        formatter: (val: number | string) => {
          return `${Number(val) / 1000}K`;
        },
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
  };
}