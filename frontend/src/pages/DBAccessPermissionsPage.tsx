import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../config/index";
import { useAuth } from "../components/Authentication/AuthenticationContext";

type PermissionData = {
  table_name: string;
  table_id: number;
  permissions: string;
};

const TABLE_HEAD = ["Tables", "Permissions", "Actions"];

const temp_data = [
  { table_name: "table 1", table_id: 12, permissions: "Admin" },
  { table_name: "table 2", table_id: 13, permissions: "View" },
  {
    table_name: "long long long table name",
    table_id: 15,
    permissions: "View",
  },
];

export default function DBAccessPermissionsPage() {
  const [open, setOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedTableId, setSelectedTableId] = useState(0);
  const [emailInput, setEmailInput] = useState("");
  const [permissionsInput, setPermissionsInput] = useState("");
  const [allPermissions, setAllPermissions] = useState<
    PermissionData[] | undefined
  >(temp_data);
  const [errorText, setErrorText] = useState("");

  const { userId } = useAuth();

  const onGivePermissionClick = (table_name: string, table_id: number) => {
    setSelectedTable(table_name);
    setSelectedTableId(table_id);
    setOpen(true);
  };

  const giveUserPermissions = async () => {
    try {
      const requestData = {
        permission: permissionsInput,
        user_email: emailInput,
        table_id: selectedTableId,
      };

      const response = await axios.post(
        `${BACKEND_API_URL}/api/user-access-permissions/`,
        requestData
      );

      console.log("Response from API:", response.data);
      // TODO if success show success toast
      setErrorText("");
      setEmailInput("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorText(JSON.stringify(error.response.data));
      } else {
        setErrorText("An unexpected error occurred");
      }
      console.error("Error while giving permissions:", error);
    }
  };

  const onClickClose = () => {
    setOpen(false);
    setErrorText("");
    setEmailInput("");
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/api/user-access-permissions/${userId}`
        );
        // console.log(response.data.data);
        setAllPermissions(response.data.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 p-10">
      <Card className="w-full max-w-4xl p-10 rounded-xl">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Your Database Permissions
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See access control permissions for each table
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
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
              {allPermissions.map(({ table_name, table_id, permissions }) => {
                const classes = "p-4 text-center";

                return (
                  <tr key={table_name} className="hover:bg-blue-gray-50/50">
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
                            className="bg-blue-500 text-white p-2 rounded-md"
                          >
                            Give Permissions
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Permissions: {selectedTable}</DialogHeader>
        <DialogBody>
          <input
            type="text"
            placeholder="User's email"
            className="w-full p-2 rounded bg-white text-black border border-gray-700 focus:outline-none focus:border-blue-500 mb-5"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <Select
            label="Select Permission type"
            className="min-h-10"
            variant="outlined"
            onChange={setPermissionsInput}
          >
            <Option className="p-3" value="Admin">
              Admin
            </Option>
            <Option className="p-3" value="View">
              View
            </Option>
          </Select>
          {errorText && <div className="text-red-400">{errorText}</div>}
        </DialogBody>
        <DialogFooter className="space-x-5 justify-center">
          <Button
            variant="gradient"
            className="bg-black"
            onClick={onClickClose}
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            className="bg-black"
            onClick={giveUserPermissions}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
