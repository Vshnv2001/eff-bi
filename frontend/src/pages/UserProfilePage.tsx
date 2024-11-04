import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Spinner,
  Select,
  Option,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../config/index";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { CameraIcon, UserCircleIcon } from "lucide-react";

type User = {
  email: string;
  first_name: string;
  last_name: string;
  organization: number;
  id: string;
};

type TableRowProps = {
  identifier: string;
  data: string | number;
};

const TableRow: React.FC<TableRowProps> = ({ identifier, data }) => {
  return (
    <tr className="hover:bg-blue-gray-50/50">
      <td className="p-4 text-center border-b border-blue-gray-50">
        <div className="flex items-center gap-3 justify-center">
          <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="font-normal">
              {identifier}
            </Typography>
          </div>
        </div>
      </td>
      <td className="p-4 text-center border-b border-blue-gray-50">
        <div className="flex justify-center">
          <Typography variant="h6" color="blue-gray" className="font-bold">
            {data}
          </Typography>
        </div>
      </td>
    </tr>
  );
};

export default function UserProfilePage() {
  const [userInfo, setUserInfo] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;

  useEffect(() => {
    if (sessionContext.loading) {
      setIsLoading(true);
    }

    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/api/users/${userId}`
        );
        // // console.log(response.data.user);
        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-16">
      <Card className="mx-auto max-w-4xl  shadow-sm p-8">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <Typography variant="h4" color="blue-gray" className="mb-2">
            Your Profile
          </Typography>
          <Typography variant="small" color="gray" className="font-normal">
            Your personal information is stored securely with us.
          </Typography>
        </CardHeader>
        
        <CardBody className="px-8 pb-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="h-36 w-36 rounded-full bg-blue-gray-50 flex items-center justify-center">
                    <UserCircleIcon className="h-full w-full text-blue-gray-500" />
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  crossOrigin="anonymous"
                  value={userInfo?.first_name || ""}
                  className="bg-blue-gray-50/50"
                  containerProps={{ className: "min-w-[100px]" }}
                  readOnly
                />
                <Input
                  label="Last Name"
                  crossOrigin="anonymous"
                  value={userInfo?.last_name || ""}
                  className="bg-blue-gray-50/50"
                  containerProps={{ className: "min-w-[100px]" }}
                  readOnly
                />
                <Input
                  label="Email"
                  crossOrigin="anonymous"
                  value={userInfo?.email || ""}
                  className="bg-blue-gray-50/50"
                  containerProps={{ className: "min-w-[100px]" }}
                  readOnly
                />
                <Input
                  label="Organization Code"
                  crossOrigin="anonymous"
                  value={userInfo?.organization?.toString() || ""}
                  className="bg-blue-gray-50/50"
                  containerProps={{ className: "min-w-[100px]" }}
                  readOnly
                />

              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
