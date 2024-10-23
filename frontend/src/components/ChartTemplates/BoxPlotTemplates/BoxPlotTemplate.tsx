import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import html2canvas from 'html2canvas';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type BoxPlotData = {
  x: string;
  y: number[];
};

type BoxPlotTemplateProps = {
  data: BoxPlotData[];
  height?: number;
};

const BoxPlotTemplate: React.FC<BoxPlotTemplateProps> = ({ data, height = 350 }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const options = {
      series: [
        {
          type: 'boxPlot',
          data: data
        }
      ],
      chart: {
        type: 'boxPlot',
        height: height,
        toolbar: { show: false },
      },
      plotOptions: {
        boxPlot: {
          colors: {
            upper: '#5C4742',
            lower: '#A5978B'
          }
        }
      }
    };

    const chart = new ApexCharts(document.querySelector("#boxplot-chart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data, height]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format: string) => {
    const chartElement = document.querySelector("#boxplot-chart") as HTMLElement;

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
        a.download = "boxplot-chart.svg";
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
          a.download = "boxplot-chart.png";
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
      <div id="boxplot-chart" />
    </div>
  );
};

export default BoxPlotTemplate;