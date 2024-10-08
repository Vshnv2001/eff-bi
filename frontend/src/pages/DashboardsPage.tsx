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
import { useAuth } from "../components/Authentication/AuthenticationContext";
import DashboardCard from "../components/DashboardModal/DashboardCard";


const mockDashboards = [
  { id: "DASH001", title: "Sales Overview", createdBy: "John Doe" },
  { id: "DASH002", title: "User Engagement", createdBy: "Jane Smith" },
  { id: "DASH003", title: "Revenue Growth", createdBy: "Alice Johnson" },
  { id: "DASH004", title: "Active Users", createdBy: "Bob Brown" },
  { id: "DASH005", title: "Conversion Rate", createdBy: "Charlie Davis" },
  { id: "DASH006", title: "Monthly Expenses", createdBy: "Eva White" },
];


export default function DashboardsPage() {
  const [open, setOpen] = useState(false);
  const [dashboardName, setDashboardName] = useState("");
  const [dashboardDescription, setDashboardDescription] = useState("");

  const {
    firstName,
    lastName,
    organizationId,
  } = useAuth();

  const handleOpen = () => {
    setOpen(!open);
    setDashboardName("");
    setDashboardDescription("");
  }

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
        setOpen={setOpen}
        dashboardName={dashboardName}
        setDashboardName={setDashboardName}
        dashboardDescription={dashboardDescription}
        setDashboardDescription={setDashboardDescription}
        firstName={firstName}
        lastName={lastName}
        organizationId={organizationId}
    />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDashboards.map((dashboard) => {
          return (
            <DashboardCard key={dashboard.id} dashboard={dashboard} />
          );
        })}
      </div>
    </div>
  );
}