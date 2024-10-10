import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Typography, Chip } from "@material-tailwind/react";
import { DashboardProps } from "./consts/DashboardProps";

interface DashboardProp {
  dashboard: DashboardProps;
}

const Dashboard: React.FC<DashboardProp> = ({ dashboard }) => {
  const navigate = useNavigate();
  return (
    <Card key={dashboard.dash_id} className="bg-gray-700 text-white cursor-pointer hover:" onClick={() => navigate(`/dashboards/${dashboard.dash_id}`)}>
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
          value={dashboard.dash_id}
          size="sm"
          variant="outlined"
          className="rounded-full text-blue-400 border-blue-400 px-2 py-1"
        />
      </CardHeader>
      <CardBody className="p-6 pt-0">
        <p> Insert Dashboard Preview Here</p>
        <div className="mt-4 flex items-center gap-4">
          <Typography variant="small" color="blue-gray" className="font-normal text-gray-400">
            Created by {dashboard.created_by}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};

export default Dashboard;