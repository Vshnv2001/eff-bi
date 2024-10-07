import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import AreaClosedChart from "../components/Dashboard/Charts/AreaCharts/AreaClosedChart";
import LineChart from "../components/Dashboard/Charts/LineCharts/LineChart";
import PieChart from "../components/Dashboard/Charts/PieCharts/PieChart";
import BarChart from "../components/Dashboard/Charts/BarCharts/BarChart";
import StatBox from "../components/Dashboard/Charts/StatBox";

import { Sales } from "./Sales";
import { Traffic } from "./Traffic";

export default function Page(): React.JSX.Element {
  return (
    <div>
      <Sales
        chartSeries={[
          {
            name: "This year",
            data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
          },
          {
            name: "Last year",
            data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
          },
        ]}
        sx={{ height: "100%" }}
      />
      <Traffic
        chartSeries={[63, 15, 22]}
        labels={["Desktop", "Tablet", "Phone"]}
        sx={{ height: "100%" }}
      />
    </div>
  );
}
