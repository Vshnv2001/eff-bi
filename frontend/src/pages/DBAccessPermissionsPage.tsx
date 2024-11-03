import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Chip,
  Spinner,
} from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../config/index";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

type PermissionData = {
  table_name: string;
  table_id: number;
  permissions: string;
};

const TABLE_HEAD = ["Tables", "Permissions", "Actions"];

// const temp_data = [
//   { table_name: "table 1", table_id: 12, permissions: "Admin" },
//   { table_name: "table 2", table_id: 13, permissions: "View" },
//   {
//     table_name: "long long long table name",
//     table_id: 15,
//     permissions: "View",
//   },
// ];

export default function DBAccessPermissionsPage() {
  const [allPermissions, setAllPermissions] = useState<
    PermissionData[] | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const sessionContext = useSessionContext();
  const userId = sessionContext.loading ? null : sessionContext.userId;

  const onGivePermissionClick = (table_name: string, table_id: number) => {
    // TODO consider encrypting the url?
    navigate(
      `/settings/table-permissions?table_name=${encodeURIComponent(
        table_name
      )}&table_id=${table_id}`
    );
  };

  useEffect(() => {
    if (sessionContext.loading) {
      setIsLoading(true);
    }

    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/api/user-access-permissions/${userId}`
        );
        // console.log(response.data.data);
        setAllPermissions(response.data.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-10">
      <Card className="w-full max-w-4xl p-10 rounded-xl">
        {allPermissions ? (
          <div>
            <CardHeader floated={false} shadow={false} className="rounded-none">
              <div className="mb-8 flex items-center justify-between gap-8">
                <div>
                  <Typography variant="h5" color="blue-gray">
                    Your Table Permissions
                  </Typography>
                  <Typography color="gray" className="mt-1 font-normal">
                    See access control permissions for each table you have
                    access to in your database.
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
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                      >
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="leading-none font-bold text-center"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allPermissions?.map(
                    ({ table_name, table_id, permissions }) => {
                      const classes = "p-4 text-center";

                      return (
                        <tr
                          key={table_name}
                          className="hover:bg-blue-gray-50/50"
                        >
                          <td className={classes}>
                            <div className="flex items-center gap-3 justify-center">
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {table_name}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex justify-center">
                              <Chip
                                value={permissions}
                                className={`m-2 text-center w-20 rounded-full ${
                                  permissions === "Admin"
                                    ? "bg-red-500"
                                    : "bg-gray-200 text-black"
                                }`}
                              />
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex justify-center">
                              {permissions === "Admin" && (
                                <button
                                  onClick={() =>
                                    onGivePermissionClick(table_name, table_id)
                                  }
                                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-400"
                                >
                                  Manage Permissions
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </CardBody>
          </div>
        ) : (
          <div className="text-lg text-center">
            You do not have access to any tables, request for permissions with
            your admin.
          </div>
        )}
      </Card>
    </div>
  );
}
