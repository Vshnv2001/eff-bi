import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { ApexOptions } from "apexcharts";
import html2canvas from "html2canvas";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface PieChartTemplateProps {
  series: number[];
  labels: string[];
  chartWidth?: number;
}

const PieChartTemplate: React.FC<PieChartTemplateProps> = ({
  series,
  labels,
  chartWidth = 500, // Increase default width
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    const fontSize = series.length > 10 ? "12px" : "14px";

    // Dynamically generate colors
    const generateColors = (count: number) => {
      const colors = [];
      const baseHue = 30;
      for (let i = 0; i < count; i++) {
        colors.push(`hsl(${(baseHue + (i * 360) / count) % 360}, 70%, 50%)`);
      }
      return colors;
    };

    const options: ApexOptions = {
      series: series,
      chart: {
        width: chartWidth,
        type: "donut",
        toolbar: { show: true, tools: { zoom: false, pan: false } },
      },
      labels: labels,
      colors: generateColors(series.length),
      dataLabels: {
        enabled: series.length <= 8,
        style: { fontSize, colors: ["#333"] },
        dropShadow: { enabled: false },
        formatter: (val, { seriesIndex, w }) => {
          const label = w.globals.labels[seriesIndex];
          const displayLabel =
            label.length > 10 ? label.slice(0, 10) + "…" : label;
          return typeof val === "number"
            ? `${displayLabel}: ${val.toFixed(1)}%`
            : "";
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 300 },
            legend: { position: "bottom" },
          },
        },
      ],
      legend: {
        position: "right",
        fontSize: fontSize,
        floating: false,
      },
      tooltip: { enabled: true },
    };

    const chart = new ApexCharts(chartRef.current as HTMLElement, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [series, labels, chartWidth]);

  const handleDownload = async (format: string) => {
    if (format === "SVG") {
      const svgData = chartRef.current?.querySelector("svg");
      if (svgData) {
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svgData)], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pie-chart.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } else if (format === "PNG") {
      const canvas = await html2canvas(chartRef.current as HTMLElement);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "pie-chart.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    }
    handleClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ position: "relative", marginTop: 30 }}>
      <div style={{ position: "absolute", top: -20, right: 10, zIndex: 1 }}>
        <IconButton onClick={handleMenuClick} size="small">
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              borderRadius: 8,
              marginTop: 5,
            },
          }}
        >
          <MenuItem
            onClick={() => handleDownload("SVG")}
            sx={{
              typography: "body2",
              color: "text.primary",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
            }}
          >
            Download as SVG
          </MenuItem>
          <MenuItem
            onClick={() => handleDownload("PNG")}
            sx={{
              typography: "body2",
              color: "text.primary",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
            }}
          >
            Download as PNG
          </MenuItem>
        </Menu>
      </div>

      <div ref={chartRef} />
    </div>
  );
};

export default PieChartTemplate;
