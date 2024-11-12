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
import { Mail, HashIcon, Building2, UserCircleIcon } from "lucide-react";

type User = {
  email: string;
  first_name: string;
  last_name: string;
  organization: number;
  organization_name: string;
  id: string;
};

const ProfileItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center space-x-4 p-4 bg-blue-100 rounded-lg shadow-md">
    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
      {icon}
    </div>
    <div className="flex-grow overflow-x-auto">
      <Typography variant="small" color="blue-gray" className="font-normal">
        {label}
      </Typography>
      <Typography variant="h6" color="blue-gray" className="font-semibold">
        {value}
      </Typography>
    </div>
  </div>
);

export default function UserProfilePage() {
  const [userInfo, setUserInfo] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;

  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Cleanup function to re-enable scrolling
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (sessionContext.loading) {
      setIsLoading(true);
    }

    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/api/users/${userId}`
        );
        // console.log(response.data.user);
        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserInfo();
  }, [[sessionContext.loading, userId]]);

  return (
    <div className="min-h-screen p-4 sm:p-8 md:p-16">
      <Card className="mx-auto max-w-4xl overflow-hidden">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 rounded-none text-center p-6"
        >
          <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
            Your Profile
          </Typography>
          <Typography variant="small" color="gray" className="font-normal">
            Your personal information is stored securely with us.
          </Typography>
        </CardHeader>
        <CardBody className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" color="blue" />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col items-center gap-4">
                <UserCircleIcon className="h-20 w-20 text-blue-500" />

                <Typography variant="h4" color="blue-gray">
                  {userInfo?.first_name} {userInfo?.last_name}
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
                <ProfileItem
                  icon={<Mail className="h-6 w-6" />}
                  label="Email"
                  value={userInfo?.email || ""}
                />
                <ProfileItem
                  icon={<HashIcon className="h-6 w-6" />}
                  label="Organization Code"
                  value={userInfo?.organization?.toString() || ""}
                />
                <ProfileItem
                  icon={<Building2 className="h-6 w-6" />}
                  label="Organization Name"
                  value={userInfo?.organization_name || ""}
                />
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
