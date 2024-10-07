import React from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";

const mockDashboards = [
  { id: "DASH001", title: "Sales Overview", createdBy: "John Doe", content: "This is a detailed view of sales data." },
  { id: "DASH002", title: "User Engagement", createdBy: "Jane Smith", content: "This dashboard shows user engagement metrics." },
  { id: "DASH003", title: "Revenue Growth", createdBy: "Alice Johnson", content: "This dashboard tracks revenue growth over time." },
  { id: "DASH004", title: "Active Users", createdBy: "Bob Brown", content: "This dashboard displays the number of active users." },
  { id: "DASH005", title: "Conversion Rate", createdBy: "Charlie Davis", content: "This dashboard shows conversion rates." },
  { id: "DASH006", title: "Monthly Expenses", createdBy: "Eva White", content: "This dashboard tracks monthly expenses." },
];

export default function DashboardPage() {
  const { dashboardId } = useParams();
  const dashboard = mockDashboards.find(d => d.id === dashboardId);

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gray-800 p-8">
        <Typography color="white" className="text-3xl font-bold">
          Dashboard not found
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <Card className="bg-gray-700 text-white">
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
          <Typography variant="body1" color="white">
            {dashboard.content}
          </Typography>
          <div className="mt-4 flex items-center gap-4">
            <Typography variant="small" color="blue-gray" className="font-normal opacity-75">
              Created by {dashboard.createdBy}
            </Typography>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
