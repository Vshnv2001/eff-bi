import { useState, useEffect } from "react";
import {
  Card,
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
import { toast } from "react-toastify";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

type UserPermissions = {
  user_email: string;
  user_id: string;
  permissions: string;
};

const TABLE_HEAD = ["User", "Permissions", "Actions on Permissions"];

// const temp_data = [
//   { user_email: "bob@email.com", user_id: "12", permissions: "Admin" },
//   { user_email: "tom@email.com", user_id: "13", permissions: "View" },
//   {
//     user_email: "longlonglonglonglonglonglong@email.com",
//     user_id: "15",
//     permissions: "View",
//   },
// ];

const TablePermissionsPage = ({
  table_name,
  table_id,
  permissions,
}: {
  table_name: string;
  table_id: number;
  permissions: string;
}) => {
  console.log(table_name, table_id);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [permissionsInput, setPermissionsInput] = useState("");
  const [removePermissionInput, setRemovePermissionInput] = useState("");
  const [allUsers, setAllUsers] = useState<UserPermissions[] | undefined>();

  const onRemovePermissionClick = (user_email: string) => {
    setSelectedUserEmail(user_email);
    setOpenRemoveDialog(true);
  };

  const giveUserPermissions = async () => {
    if (!emailInput) {
      toast.error("Email is required!");
      return;
    }
    if (!permissionsInput) {
      toast.error("Permission type is required!");
      return;
    }

    try {
      const requestData = {
        permission: permissionsInput,
        user_email: emailInput,
        table_id: table_id,
      };

      const response = await axios.post(
        `${BACKEND_API_URL}/api/user-access-permissions/`,
        requestData
      );

      if (response.status === 201) {
        toast.success("Permission added successfully!");
        setEmailInput("");
        fetchTableUsers();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // console.log(JSON.stringify(error.response.data));
        toast.error("Your organization does not have this user");
      } else {
        // console.log("An unexpected error occurred", error);
        toast.error("Error while giving permissions");
      }
    }
  };

  const removeUserPermissions = async () => {
    if (!removePermissionInput) {
      toast.error("Permission type is required!");
      return;
    }
    const urlPartial =
      removePermissionInput == "Admin" ? "delete-admin" : "delete";

    try {
      const response = await axios.delete(
        `${BACKEND_API_URL}/api/user-access-permissions/${urlPartial}/${selectedUserEmail}/${table_id}/`
      );

      if (response.status === 200) {
        setOpenRemoveDialog(false);
        toast.success("User removed successfully!");
        setRemovePermissionInput("");
        fetchTableUsers();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // console.log(JSON.stringify(error.response.data));
        toast.error("User does not have Admin permission for this table");
      } else {
        // console.log(error);
        toast.error("Error while removing permissions:");
      }
    }
  };

  const onClickCloseAddDialog = () => {
    setOpenAddDialog(false);
    setEmailInput("");
  };

  const onClickCloseRemoveDialog = () => {
    setOpenRemoveDialog(false);
    fetchTableUsers();
    setRemovePermissionInput("");
  };

  const sessionContext = useSessionContext();
  if (sessionContext.loading || !sessionContext.userId) {
    return;
  }
  const userId = sessionContext.userId;

  const fetchTableUsers = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_API_URL}/api/user-access-permissions/table/${table_id}`
      );
      response.data.data = response.data.data.filter(
        (user: UserPermissions) => user.user_id !== userId
      );
      // // console.log(response.data.data);
      setAllUsers(response.data.data);
    } catch (error) {
      //console.log(error);
      //console.error("Error fetching table users:", error);
      toast.error("Error retrieving table users");
    }
  };

  useEffect(() => {
    fetchTableUsers();
  }, []);

  console.log(permissions);

  return (
    <div className="flex flex-col items-center min-h-screen p-10">
      <div className="w-full max-w-4xl">
      <div className="mb-8 flex items-center justify-between gap-8">
        <div>
          <Typography variant="h3" color="blue-gray">
            Table: {table_name}
            </Typography>
            {permissions === "Admin" && (
              <Typography color="gray" className="mt-1 font-normal">
                See all users who have permissions for this table
            </Typography>
            )}
        </div>
        {permissions === "Admin" && (
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setOpenAddDialog(true)}
            className="bg-blue-500 text-white p-2 pl-5 pr-5 rounded-md hover:bg-blue-400"
          >
            Add Users
          </button>
          </div>
        )}
        </div>
      </div>
      <Card className="w-full max-w-4xl p-10 rounded-sm">
        <CardBody className="px-0">
        {permissions === "View" && (
          <div className="mb-8 flex flex-col items-center justify-between gap-8">
            <Typography variant="h5" color="blue-gray">
              You only have View permission for this table.
            </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Please ask any Table Administrator to give you 'Admin' access if you need to provide access to other users.
              </Typography>
            </div>
          )}
          {(permissions === "Admin") && (
            <table className="overflow-x-auto w-full min-w-max text-left">
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
              {allUsers &&
                allUsers.map(({ user_email, permissions }) => {
                  const classes = "p-4 text-center";

                  return (
                    <tr key={user_email} className="hover:bg-blue-gray-50/50">
                      <td className={classes}>
                        <div className="flex items-center gap-3 justify-center">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {user_email}
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
                        <div className="flex justify-center items-center space-x-3">
                          <button
                            onClick={() => onRemovePermissionClick(user_email)}
                            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* dialog for add user */}
      <Dialog open={openAddDialog} handler={() => setOpenAddDialog(false)}>
        <DialogHeader>Give permissions to a user</DialogHeader>
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
            onChange={(value) => setPermissionsInput(value as string)}
          >
            <Option className="p-3" value="Admin">
              Admin
            </Option>
            <Option className="p-3" value="View">
              View
            </Option>
          </Select>
        </DialogBody>
        <DialogFooter className="space-x-5 justify-center">
          <Button
            color="red"
            variant="gradient"
            onClick={onClickCloseAddDialog}
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="blue" onClick={giveUserPermissions}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* dialog for remove user  */}
      <Dialog
        open={openRemoveDialog}
        handler={() => setOpenRemoveDialog(false)}
      >
        <DialogHeader>Remove {selectedUserEmail}'s permission</DialogHeader>
        <DialogBody>
          <h5 className="text-black">
            Select the permission to <strong>remove</strong> from this user.
            Note that removing 'View' permission would also remove 'Admin'
            permission.
          </h5>
          <br />
          <Select
            label="Select Permission type"
            className="min-h-10"
            variant="outlined"
            onChange={(value) => setRemovePermissionInput(value as string)}
          >
            <Option className="p-3" value="Admin">
              Admin
            </Option>
            <Option className="p-3" value="View">
              View
            </Option>
          </Select>
        </DialogBody>
        <DialogFooter className="space-x-5 justify-center">
          <Button
            color="red"
            variant="gradient"
            onClick={onClickCloseRemoveDialog}
          >
            <span>Cancel</span>
          </Button>
          <Button
            color="blue"
            variant="gradient"
            onClick={removeUserPermissions}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default TablePermissionsPage;
