import { useState, useEffect, FormEvent } from "react";
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
import { Button, CardContent, Menu, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

type PermissionData = {
  table_name: string;
  table_id: number;
  permissions: string;
};

type UserPermissionData = {
  user_id: number;
  user_email: string;
  permissions: string;
};

const TABLE_HEAD = ["Tables", "Permissions"];

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
  const [allPermissions, setAllPermissions] = useState<PermissionData[] | undefined>()
  const [selectedTable, setSelectedTable] = useState<PermissionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();
  const [userPermissions, setUserPermissions] = useState<UserPermissionData[] | undefined>()

  const sessionContext = useSessionContext()
  const userId = sessionContext.loading ? null : sessionContext.userId

  useEffect(() => {
    if (selectedTable) {
      fetchUserPermissions(selectedTable.table_id)
    }
  }, [selectedTable]);

  const fetchUserPermissions = async (table_id: number) => {
    const response = await axios.get(`${BACKEND_API_URL}/api/user-access-permissions/table/${table_id}`)
    setUserPermissions(response.data.data)
  }

  useEffect(() => {
    if (sessionContext.loading) {
      setIsLoading(true)
      return
    }

    const fetchPermissions = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/api/user-access-permissions/${userId}`)
        setAllPermissions(response.data.data)
        if (response.data.data.length > 0) {
          setSelectedTable(response.data.data[0])
        }
      } catch (error) {
        console.error("Error fetching permissions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPermissions()
  }, [userId, sessionContext.loading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-10 w-10" />
      </div>
    )
  }

  if (!allPermissions || allPermissions.length === 0) {
    return (

      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Typography variant="paragraph">
              You do not have access to any tables. Please request permissions from your admin.
            </Typography>
          </CardContent>
        </Card>
      </div>
    )
  }

  function handlePermissionChange(user_id: number, newPermission: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex min-h-screen bg-background p-4 md:p-8 ">
      <div className="flex w-full max-w-6xl mx-auto gap-4 md:gap-8 mt-4">
        <Card className="w-1/3 flex flex-col items-center justify-center">
          <div className="p-5 text-center">
            <Typography variant="h5">Tables</Typography>
            <Typography variant="paragraph">Select a table to view details</Typography>
          </div>
          <CardContent className="mt-5 flex flex-col items-center">
            <div className="h-[calc(100vh-12rem)] overflow-y-auto">
              <ul className="space-y-2">
                {allPermissions.map((table) => (
                  <li key={table.table_id}>
                    <Button
                      variant={selectedTable?.table_id === table.table_id ? "contained" : "outlined"}
                      className="w-full justify-center"
                      onClick={() => setSelectedTable(table)}
                    >
                      {table.table_name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card className="w-2/3 flex flex-col items-center justify-center">
          <div className="p-5 text-center">
            <Typography variant="h3">{selectedTable?.table_name || "Select a table"}</Typography>
          </div>
          <CardContent className="mt-5 flex flex-col items-center h-full">
            {selectedTable ? (
              <div className="flex-grow space-y-4 text-center">
                <div>
                  <Typography variant="h6">Your Permissions:</Typography>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm ${
                      selectedTable.permissions === "Admin" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedTable.permissions}
                  </span>
                </div>
                {selectedTable.permissions === "Admin" && (
                  <div className="flex-grow">
                    <Table className="mx-4 items-center w-full">
                      <TableHead>
                        <TableRow>
                          <TableCell>User Email</TableCell>
                          <TableCell>Permissions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userPermissions?.map((user) => (
                          <TableRow key={user.user_id}>
                            <TableCell>{user.user_email}</TableCell>
                            <TableCell>
                              <Select
                                value={user.permissions}
                                onChange={(event: any) => handlePermissionChange(user.user_id, event.target.value)}
                                variant="outlined"
                              >
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="View">View</MenuItem>
                                {
                                  user.permissions !== "No Access" ? (
                                    <MenuItem value="No Access">Remove Access</MenuItem>
                                  ) : (
                                    <MenuItem value="View">Give Access</MenuItem>
                                  )
                                }
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ) : (
              <p>Select a table from the list to view its details.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
