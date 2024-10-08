import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Input,
  Textarea,
} from "@material-tailwind/react";

export default function DashboardModal({ open, handleOpen, handleCreate, dashboardName, setDashboardName, dashboardDescription, setDashboardDescription }) {
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="md"
      className="bg-gray-800 text-white flex flex-col items-center justify-between h-[50%]"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader className="text-white border-b border-gray-700">Create Dashboard</DialogHeader>
      <DialogBody divider className="border-gray-700">
        <div className="mb-4">
          <Typography variant="small" color="blue-gray" className="font-normal mb-2 text-gray-400">
            Dashboard Name
          </Typography>
          <Input
            type="text"
            placeholder="Enter dashboard name"
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            className="!border-gray-600 focus:!border-gray-500 bg-gray-700 text-white"
            labelProps={{
              className: "hidden",
            }}
            containerProps={{
              className: "min-w-[100px]",
            }}
          />
        </div>
        <div className="mb-4">
          <Typography variant="small" color="blue-gray" className="font-normal mb-2 text-gray-400">
            Dashboard Description
          </Typography>
          <Textarea
            placeholder="Enter dashboard description"
            value={dashboardDescription}
            onChange={(e) => setDashboardDescription(e.target.value)}
            className="!border-gray-600 focus:!border-gray-500 bg-gray-700 text-white"
            labelProps={{
              className: "hidden",
            }}
            containerProps={{
              className: "min-w-[100px]",
            }}
          />
        </div>
      </DialogBody>
      <DialogFooter className="border-t border-gray-700">
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-2 text-red-500 hover:bg-red-500/10"
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={handleCreate}
          className="bg-green-500 hover:bg-green-600"
        >
          Create
        </Button>
      </DialogFooter>
    </Dialog>
  );
}