"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import { alpha, useTheme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";
import { ArrowClockwise as ArrowClockwiseIcon } from "@phosphor-icons/react/dist/ssr/ArrowClockwise";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { ApexOptions } from "apexcharts";

import { Chart } from "../Chart";

export interface HorizontalBarChartProps {
  chartSeries: { name: string; data: number[] }[];
  categories: string[];
  sx?: SxProps;
}

export function HorizontalBarChartTemplate({
  chartSeries,
  categories,
  sx,
}: HorizontalBarChartProps): React.JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const chartOptions = useChartOptions(categories);

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
            <Button
              color="inherit"
              size="small"
              startIcon={
                <ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />
              }
            >
              Sync
            </Button>
          </div>
        }
        title="Sales"
      />
      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar" // Keeping the type as 'bar'
          width="100%"
        />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
        >
          View Data
        </Button>
      </CardActions>
    </Card>
  );
}

function useChartOptions(categories: string[]): ApexOptions {
    const theme = useTheme();
  
    const generateBlueShades = (count: number): string[] => {
      const shades: string[] = [];
      for (let i = 0; i < count; i++) {
        const lightness = 40 + i * (60 / count);
        shades.push(`hsl(210, 100%, ${lightness}%)`);
      }
      return shades;
    };
  
    const colors = generateBlueShades(categories.length);
  
    return {
      chart: {
        background: "transparent",
        stacked: false,
        toolbar: { show: false },
      },
      colors: colors,
      dataLabels: { enabled: false },
      fill: { opacity: 1, type: "solid" },
      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 2,
        xaxis: { lines: { show: true } }, // Show grid lines on the x-axis
        yaxis: { lines: { show: false } }, // Hide grid lines on the y-axis
      },
      legend: { show: false },
      plotOptions: { bar: { horizontal: true } }, // Set horizontal to true for horizontal bars
      stroke: { colors: ["transparent"], show: true, width: 2 },
      theme: { mode: theme.palette.mode },
      xaxis: {
        categories: categories, // Set categories here for horizontal bars
        axisBorder: { color: theme.palette.divider, show: true },
        axisTicks: { color: theme.palette.divider, show: true },
        labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
      },
      yaxis: {
        labels: {
          style: { colors: theme.palette.text.secondary },
        },
      },
    };
  }  