import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import DashboardModal from "../components/DashboardModal/DashboardModal";
import { useNavigate } from "react-router-dom";

const mockDashboards = [
  { id: "DASH001", title: "Sales Overview", createdBy: "John Doe" },
  { id: "DASH002", title: "User Engagement", createdBy: "Jane Smith" },
  { id: "DASH003", title: "Revenue Growth", createdBy: "Alice Johnson" },
  { id: "DASH004", title: "Active Users", createdBy: "Bob Brown" },
  { id: "DASH005", title: "Conversion Rate", createdBy: "Charlie Davis" },
  { id: "DASH006", title: "Monthly Expenses", createdBy: "Eva White" },
];


export default function DashboardsPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dashboardName, setDashboardName] = useState("");
  const [dashboardDescription, setDashboardDescription] = useState("");

  const handleOpen = () => setOpen(!open);
  const handleCreate = () => {
    // Add your create dashboard logic here
    console.log("Creating dashboard:", dashboardName, dashboardDescription);
    setOpen(false);
  };
  return (
    <div className="min-h-screen bg-gray-800 p-8">
        <div className="flex items-center justify-between mb-8">
        <Typography color="white" className="text-3xl font-bold">
            Dashboards
        </Typography>
        <Button variant="text" size="sm" color="white" className="font-bold bg-blue-500 hover:bg-blue-600 hover:text-white" onClick={handleOpen}>
          Create Dashboard
        </Button>
    </div>
    <DashboardModal
        open={open}
        handleOpen={handleOpen}
        handleCreate={handleCreate}
        dashboardName={dashboardName}
        setDashboardName={setDashboardName}
        dashboardDescription={dashboardDescription}
        setDashboardDescription={setDashboardDescription}
    />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDashboards.map((dashboard) => {
          return (
            <Card key={dashboard.id} className="bg-gray-700 text-white cursor-pointer hover:" onClick={() => navigate(`/dashboards/${dashboard.id}`)}>
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="flex items-center justify-between m-0 p-6"
              >
                <Typography variant="h6" color="white">
                  {dashboard.title}
                </Typography>
                <Chip
                  value={dashboard.id}
                  size="sm"
                  variant="outlined"
                  className="rounded-full text-blue-400 border-blue-400 px-2 py-1"
                />
              </CardHeader>
              <CardBody className="p-6 pt-0">
                <p> Insert Dashboard Preview Here</p>
                <div className="mt-4 flex items-center gap-4">
                  <Typography variant="small" color="blue-gray" className="font-normal opacity-75">
                    Created by {dashboard.createdBy}
                  </Typography>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}