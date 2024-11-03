import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Spinner,
} from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../config/index";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-10">
      <Card className="w-full max-w-4xl p-10 rounded-xl">
        <div>
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Your Profile
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  Your personal information is stored securely with us.
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
            {isLoading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <Spinner className="h-10 w-10" />
              </div>
            )}
            <table className="w-full min-w-max table-auto text-left">
              <tbody>
                {userInfo && (
                  <TableRow
                    identifier="First Name"
                    data={userInfo.first_name}
                  />
                )}
                {userInfo && (
                  <TableRow identifier="Last Name" data={userInfo.last_name} />
                )}
                {userInfo && (
                  <TableRow identifier="Email" data={userInfo.email} />
                )}
                {userInfo && (
                  <TableRow
                    identifier="Organization Code"
                    data={userInfo.organization}
                  />
                )}
              </tbody>
            </table>
          </CardBody>
        </div>
      </Card>
    </div>
  );
}
