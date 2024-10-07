"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useTheme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Chart } from "../Chart";
import { ApexOptions } from "apexcharts";

export interface AreaChartProps {
  chartSeries: { name: string; data: number[] }[];
  labels: string[];
  sx?: SxProps;
}

export function AreaChartTemplate({
  chartSeries,
  labels,
  sx,
}: AreaChartProps): React.JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const chartOptions = useChartOptions(labels);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = (format: string) => {
    console.log(`Download chart as: ${format}`);
    handleClose();
  };

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
              <MenuItem onClick={() => handleDownload("CSV")}>
                Download as CSV
              </MenuItem>
            </Menu>
          </div>
        }
        title="Fundamental Analysis of Stocks"
        subheader="Price Movements"
      />
      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="area"
          width="100%"
        />
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: {
      type: 'area',
      height: 350,
      zoom: { enabled: false },
      background: "transparent",
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    title: {
      text: 'Fundamental Analysis of Stocks',
      align: 'left',
    },
    subtitle: {
      text: 'Price Movements',
      align: 'left',
    },
    labels,
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      opposite: true,
    },
    legend: {
      horizontalAlign: 'left',
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    theme: { mode: theme.palette.mode },
  };
}