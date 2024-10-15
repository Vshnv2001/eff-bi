import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Input,
  Textarea,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";

// Define the props type
interface DashboardFormProps {
  open: boolean;
  handleOpen: () => void;
  setOpen: (open: boolean) => void;
  dashboardName: string;
  setDashboardName: (name: string) => void;
  dashboardDescription: string;
  setDashboardDescription: (description: string) => void;
}

export default function DashboardForm({
  open,
  handleOpen,
  setOpen,
  dashboardName,
  setDashboardName,
  dashboardDescription,
  setDashboardDescription,
}: DashboardFormProps) {
  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/`,
        {
          title: dashboardName,
          description: dashboardDescription,
        }
      );
      console.log("Dashboard created successfully:", response.data);
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating dashboard:", error);
    }
  };

  const [info, setInfo] = useState(false);
  const handleInfo = () => setInfo(!info);

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="md"
      className="bg-gray-300 border-4 border-black text-black flex flex-col items-center justify-between h-[55%]"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader className="text-black">Create Dashboard</DialogHeader>

      <DialogBody className="overflow-y-scroll pr-2">
        <div className="mb-4">
          <Typography
            variant="h6"
            color="blue-gray"
            className="font-medium mb-2"
          >
            Dashboard Name
          </Typography>
          <Input
            type="text"
            placeholder="Enter dashboard name"
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            className="!border-gray-300 focus:!border-blue-500"
            labelProps={{
              className: "hidden",
            }}
            containerProps={{
              className: "min-w-[100px]",
            }}
            crossOrigin="anonymous"
          />
        </div>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Typography
              variant="h6"
              color="blue-gray"
              className="font-medium mr-2"
            >
              Data Query Prompt
            </Typography>
            <IconButton
              variant="text"
              className="w-5 h-5 p-0"
              onClick={handleInfo}
            >
              <InformationCircleIcon className="h-5 w-5" />
            </IconButton>
            <Dialog open={info} handler={handleInfo}>
              <DialogHeader>Info</DialogHeader>
              <DialogBody>
                Describe the data insights you want to extract from your
                uploaded data.
              </DialogBody>
              <DialogFooter>
                <Button variant="text" onClick={handleInfo}>
                  Close
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
          <Textarea
            placeholder="e.g., 'Show monthly sales trends and top-performing products'"
            value={dashboardDescription}
            onChange={(e) => setDashboardDescription(e.target.value)}
            className="!border-gray-300 focus:!border-blue-500 min-h-[120px]"
            labelProps={{
              className: "hidden",
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
