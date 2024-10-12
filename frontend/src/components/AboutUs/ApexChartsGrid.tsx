import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Grid, Card, CardContent, Box } from '@mui/material';
import { ApexOptions } from 'apexcharts';

const generateMockData = (length: number) => {
  return Array.from({ length }, (_, i) => ({
    x: i + 1,
    y: Math.floor(Math.random() * 100) + 1
  }));
};

const ApexChartsGrid: React.FC = () => {
  const commonOptions: ApexOptions = {
    chart: {
      height: 160,
      width: '100%',
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { width: 2 },
    grid: {
      show: true,
      borderColor: '#90A4AE',
      strokeDashArray: 0,
      position: 'back',
    },
    xaxis: {
      categories: Array.from({ length: 5 }, (_, i) => `D${i + 1}`),
      labels: { style: { fontSize: '8px' } }
    },
    yaxis: {
      labels: { style: { fontSize: '8px' } }
    },
    legend: { show: false },
    tooltip: { enabled: true },
  };

  const charts = [
    { type: 'line', title: 'Line', data: [{ data: generateMockData(5) }] },
    { type: 'area', title: 'Area', data: [{ data: generateMockData(5) }] },
    { type: 'bar', title: 'Bar', data: [{ data: generateMockData(5) }] },
    { type: 'scatter', title: 'Scatter', data: [{ data: generateMockData(5) }] },
    { type: 'pie', title: 'Pie', data: generateMockData(5).map(item => item.y) },
    { type: 'radar', title: 'Radar', data: [{ data: generateMockData(5).map(item => item.y) }] },
    { type: 'polarArea', title: 'Polar', data: generateMockData(5).map(item => item.y) },
    { type: 'heatmap', title: 'Heatmap', data: [{ data: generateMockData(5) }] },
    { type: 'donut', title: 'Donut', data: generateMockData(5).map(item => item.y) }
  ];

  return (
    <Card elevation={3} sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <CardContent sx={{ padding: '16px !important' }}>
        <Grid container spacing={2}>
          {charts.map((chart, index) => (
            <Grid item xs={4} key={index}>
              <Card variant="outlined">
                <CardContent sx={{ padding: '8px !important', '&:last-child': { paddingBottom: '8px' } }}>
                  <ReactApexChart
                    options={{
                      ...commonOptions,
                      chart: { ...commonOptions.chart, type: chart.type as any },
                      title: { 
                        text: chart.title, 
                        align: 'center', 
                        style: { 
                          fontSize: '12px',
                          fontWeight: 'bold'
                        } 
                      },
                      plotOptions: {
                        pie: {
                          donut: {
                            size: '65%'
                          }
                        }
                      }
                    }}
                    series={chart.data}
                    type={chart.type as any}
                    height={160}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ApexChartsGrid;