// DashboardForm.tsx
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Textarea,
  IconButton,
  ThemeProvider,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";

interface DashboardFormProps {
  open: boolean;
  handleOpen: () => void;
  setOpen: (open: boolean) => void;
  dashboardName: string;
  setDashboardName: (name: string) => void;
  dashboardDescription: string;
  setDashboardDescription: (description: string) => void;
  onDashboardCreated?: (success: boolean, message: string) => void;
}

const customTheme = {
  dialog: {
    defaultProps: {
      size: "md",
      dismiss: {},
      animate: {
        unmount: {},
        mount: {},
      },
      className: "",
    },
    valid: {
      sizes: ["xs", "sm", "md", "lg", "xl", "xxl"],
    },
    styles: {
      base: {
        backdrop: {
          display: "grid",
          placeItems: "place-items-center",
          position: "fixed",
          top: 0,
          left: 0,
          width: "w-screen",
          height: "h-screen",
          backgroundColor: "bg-black",
          backgroundOpacity: "bg-opacity-0",
          backdropFilter: "backdrop-blur-xs",
        },
      },
    },
  },
};

export default function DashboardForm({
  open,
  handleOpen,
  setOpen,
  dashboardName,
  setDashboardName,
  dashboardDescription,
  setDashboardDescription,
  onDashboardCreated,
}: DashboardFormProps) {
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleCreate = async () => {
    try {
      if (!dashboardName.trim()) {
        onDashboardCreated?.(false, "Dashboard name is required");
        return;
      }

      if (!dashboardDescription.trim()) {
        onDashboardCreated?.(false, "Dashboard description is required");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/`,
        {
          title: dashboardName,
          description: dashboardDescription,
        }
      );

      if (isMounted) {
        onDashboardCreated?.(true, "Dashboard created successfully!");
        setOpen(false);
      }
    } catch (error: any) {
      console.error("Error creating dashboard:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create dashboard";
      if (isMounted) {
        onDashboardCreated?.(false, errorMessage);
      }
    }
  };

  const [info, setInfo] = useState(false);
  const handleInfo = () => setInfo(!info);

  return (
    <ThemeProvider value={customTheme}>
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

        <DialogBody className="overflow-y-scroll pr-2 w-full">
          <div className="mb-4">
            <Typography
              variant="h6"
              color="blue-gray"
              className="font-medium mb-2"
            >
              Dashboard Name
            </Typography>
            <Textarea
              placeholder="Enter dashboard name"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              className="border border-gray-400 focus:!border-blue-500 w-full min-h-[60px]"
              labelProps={{
                className: "hidden",
              }}
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
            </div>
            <Textarea
              placeholder="e.g., 'Show monthly sales trends and top-performing products'"
              value={dashboardDescription}
              onChange={(e) => setDashboardDescription(e.target.value)}
              className="!border border-gray-400 focus:!border-blue-500 w-full min-h-[120px]"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
        </DialogBody>

        <div className="flex justify-between w-full p-4">
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="text-red-500 hover:bg-red-500/10"
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
        </div>
      </Dialog>

      <Dialog open={info} handler={handleInfo}>
        <DialogHeader>Query Prompt</DialogHeader>
        <DialogBody>
          Describe the data insights you want to extract from your uploaded
          data.
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={handleInfo}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </ThemeProvider>
  );
}
