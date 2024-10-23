import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import html2canvas from 'html2canvas';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type CandlestickData = {
  x: Date | number;
  y: [number, number, number, number];
};

interface CandlestickChartProps {
  data: CandlestickData[];
  title?: string;
  height?: number;
}

const CandlestickTemplate: React.FC<CandlestickChartProps> = ({ data, title = 'Candlestick Chart', height = 350 }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const options = {
      series: [{
        data: data
      }],
      chart: {
        type: 'candlestick',
        height: height,
        toolbar: { show: false },
      },
      title: {
        text: title,
        align: 'left'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => chart.destroy();
  }, [data, title, height]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format: string) => {
    const chartElement = chartRef.current;

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
        a.download = "candlestick-chart.svg";
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
          a.download = "candlestick-chart.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    }

    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleMenuClick} size="small" style={{ marginBottom: '10px' }}>
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
      <div ref={chartRef}></div>
    </div>
  );
};

export default CandlestickTemplate;