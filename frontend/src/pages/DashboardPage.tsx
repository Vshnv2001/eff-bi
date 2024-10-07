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

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m={2}>
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap={2}
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          sx={{
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatBox
            title="12,361"
            subtitle="Emails Sent"
            progress={0.75}
            increase="+14%"
            icon={
              <EmailIcon sx={{ color: colors.greenAccent[600], fontSize: 26 }} />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          sx={{
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatBox
            title="431,225"
            subtitle="Sales Obtained"
            progress={0.50}
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: 26 }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          sx={{
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatBox
            title="32,441"
            subtitle="New Clients"
            progress={0.30}
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: 26 }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          sx={{
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatBox
            title="1,325,134"
            subtitle="Traffic Received"
            progress={0.80}
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: 26 }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box gridColumn="span 8" gridRow="span 2" sx={{ backgroundColor: colors.primary[400] }}>
          <Box
            mt={3}
            px={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Revenue Generated
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon sx={{ fontSize: 26, color: colors.greenAccent[500] }} />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" mt={-2}>
            <LineChart />
          </Box>
        </Box>

        <Box gridColumn="span 4" gridRow="span 2" sx={{ backgroundColor: colors.primary[400], overflow: "auto" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p={2}
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box gridColumn="span 4" gridRow="span 2" sx={{ backgroundColor: colors.primary[400], p: 3 }}>
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
            <BarChart />
            <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: 2 }}>
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>

        <Box gridColumn="span 4" gridRow="span 2" sx={{ backgroundColor: colors.primary[400], p: 3 }}>
          <Typography variant="h5" fontWeight="600">
            Sales Quantity
          </Typography>
          <Box height="250px" mt={-2}>
            <PieChart />
          </Box>
        </Box>

        <Box gridColumn="span 4" gridRow="span 2" sx={{ backgroundColor: colors.primary[400], p: 3 }}>
          <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <AreaClosedChart />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;