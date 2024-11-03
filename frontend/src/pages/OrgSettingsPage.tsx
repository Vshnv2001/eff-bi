"use client";

import { useState } from "react";
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
} from "@material-tailwind/react";

interface User {
  img: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
}

const TABLE_HEAD = ["Member", "Role"];

const TABLE_ROWS = [
  {
    img: "/placeholder.svg?height=32&width=32",
    name: "John Michael",
    firstName: "John",
    lastName: "Michael",
    role: "Admin",
  },
  {
    img: "/placeholder.svg?height=32&width=32",
    name: "Alexa Liras",
    firstName: "Alexa",
    lastName: "Liras",
    role: "Member",
  },
  {
    img: "/placeholder.svg?height=32&width=32",
    name: "Laurent Perrier",
    firstName: "Laurent",
    lastName: "Perrier",
    role: "Member",
  },
  {
    img: "/placeholder.svg?height=32&width=32",
    name: "Michael Levi",
    firstName: "Michael",
    lastName: "Levi",
    role: "Member",
  },
  {
    img: "/placeholder.svg?height=32&width=32",
    name: "Richard Gran",
    firstName: "Richard",
    lastName: "Gran",
    role: "Member",
  },
];

export default function OrgSettingsPage() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleOpen = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-10">
      <Card className="w-full max-w-4xl p-10 rounded-xl">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Organization Members
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all members in your organization
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70 text-center"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(
                ({ img, name, firstName, lastName, role }, index) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4 text-center"
                    : "p-4 border-b border-blue-gray-50 text-center";

                  return (
                    <tr
                      key={name}
                      className="hover:bg-blue-gray-50/50 cursor-pointer"
                      onClick={() =>
                        handleOpen({ img, name, firstName, lastName, role })
                      }
                    >
                      <td className={classes}>
                        <div className="flex items-center gap-3 justify-center">
                          {/* <Avatar src={img} alt={name} size="sm" /> */}
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {firstName}
                            </Typography>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            >
                              {lastName}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex justify-center">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={role}
                            color={role === "Admin" ? "green" : "blue-gray"}
                            className={`p-2 rounded-md text-center w-20 ${
                              role === "Admin" ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Dialog
        open={open}
        size="sm"
        handler={() => setOpen(false)}
        className="fixed flex mx-auto flex-col w-1/2 h-1/2 items-center justify-center p-10 bg-gray-300 z-50"
      >
        <DialogHeader>User Details</DialogHeader>
        <DialogBody divider>
          {selectedUser && (
            <div className="flex items-center gap-4">
              {/* <Avatar src={selectedUser.img} alt={selectedUser.name} size="xl" /> */}
              <div>
                <Typography variant="h6">{selectedUser.name}</Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal"
                >
                  {selectedUser.role}
                </Typography>
              </div>
            </div>
          )}

          {/* New Table inside Dialog */}
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70 text-center"
                  >
                    Table Name
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70 text-center"
                  >
                    Access Granted Date
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70 text-center"
                  >
                    Access Expiry Date
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Add rows here as needed */}
              <tr>
                <td className="p-4 text-center">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    GL 2024
                  </Typography>
                </td>
                <td className="p-4 text-center">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    21/02/2024
                  </Typography>
                </td>
                <td className="p-4 text-center">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    21/02/2025
                  </Typography>
                </td>
              </tr>
            </tbody>
          </table>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => setOpen(false)}
            className="mr-1 bg-red-500"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            onClick={() => setOpen(false)}
            className="bg-green-500"
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
