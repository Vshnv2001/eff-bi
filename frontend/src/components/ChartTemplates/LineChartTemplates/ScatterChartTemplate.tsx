import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts';
import html2canvas from 'html2canvas';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ScatterChartProps {
  series: {
    name: string;
    data: [number, number][];
  }[];
  chartHeight?: number;
}

const ScatterChartTemplate: React.FC<ScatterChartProps> = ({
  series,
  chartHeight = 350,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const options: ApexOptions = {
      series: series,
      chart: {
        height: chartHeight,
        type: 'scatter',
        zoom: {
          enabled: true,
          type: 'xy',
        },
      },
      xaxis: {
        tickAmount: 10,
        labels: {
          formatter: function(val) {
            return parseFloat(val as any).toFixed(1);
          },
        },
      },
      yaxis: {
        tickAmount: 7,
      },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [series, chartHeight]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format: string) => {
    const chartElement = chartRef.current;

    if (!chartElement) return;

    if (format === 'SVG') {
      const svgData = chartElement.querySelector('svg');
      if (svgData) {
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svgData)], {
          type: 'image/svg+xml;charset=utf-8',
        });
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'scatter-chart.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } else if (format === 'PNG') {
      const canvas = await html2canvas(chartElement);
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'scatter-chart.png';
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
        <MenuItem onClick={() => handleDownload('SVG')}>
          Download as SVG
        </MenuItem>
        <MenuItem onClick={() => handleDownload('PNG')}>
          Download as PNG
        </MenuItem>
      </Menu>
      <div ref={chartRef} id="scatter-chart" />
    </div>
  );
};

export default ScatterChartTemplate;