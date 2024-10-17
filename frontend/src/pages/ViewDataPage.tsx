import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Chip,
} from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../config/index";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import DataTable from "../components/DataTable/DataTable";

export default function ViewDataPage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;  // Don't fetch if userId is null
      try {
        const response = await axios.get(`${BACKEND_API_URL}/api/data/${userId}`);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  if (sessionContext.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 p-10">
      <Card className="w-full max-w-4xl p-10 rounded-xl">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <Typography variant="h5" color="blue-gray">
            View Data
          </Typography>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <DataTable data={data} /> {/* Use DataTable here */}
        </CardBody>
      </Card>
    </div>
  );
}
