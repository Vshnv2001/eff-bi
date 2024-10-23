import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  Textarea,
  ThemeProvider,
  Button,
} from "@material-tailwind/react";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
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
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleCreate = async () => {
    try {
      setLoading(true);

      if (!dashboardName.trim()) {
        onDashboardCreated?.(false, "Dashboard name is required");
        setLoading(false);
        return;
      }

      if (!dashboardDescription.trim()) {
        onDashboardCreated?.(false, "Dashboard description is required");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/`,
        {
          title: dashboardName,
          description: dashboardDescription,
        }
      );

      console.log("response", response);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider value={customTheme}>
      <Dialog
        open={open}
        handler={handleOpen}
        size="md"
        className="bg-gray-300 border-4 border-black text-black flex flex-col items-center justify-between h-[70%] w-full overflow-y-scroll"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="text-black">Create Dashboard</DialogHeader>

        <DialogBody className=" pr-2 w-full">
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

          <div>
            <div className="flex items-center mb-2">
              <Typography
                variant="h6"
                color="blue-gray"
                className="font-medium mr-2"
              >
                Dashboard Description
              </Typography>
            </div>
            <Textarea
              placeholder="Enter dashboard description"
              value={dashboardDescription}
              onChange={(e) => setDashboardDescription(e.target.value)}
              className="border border-gray-400 focus:!border-blue-500 w-full min-h-[120px]"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
        </DialogBody>

        <Box className="flex justify-center space-x-5 mb-4">
          <Button
            color="red"
            onClick={handleOpen}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            color="blue"
            disabled={isLoading}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleCreate}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </Box>
      </Dialog>
    </ThemeProvider>
  );
}
