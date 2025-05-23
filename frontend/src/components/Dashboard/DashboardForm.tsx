import { Typography, Textarea, Button } from "@material-tailwind/react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Box } from "@mui/material";

interface DashboardFormProps {
  dashboardName: string;
  setDashboardName: (name: string) => void;
  dashboardDescription: string;
  setDashboardDescription: (description: string) => void;
  onDashboardCreated?: () => void;
  onClose: () => void;
}

export default function DashboardForm({
  dashboardName,
  setDashboardName,
  dashboardDescription,
  setDashboardDescription,
  onDashboardCreated,
  onClose,
}: DashboardFormProps) {
  const [isLoading, setLoading] = useState(false);

  const titleLimit = 50;
  const descriptionLimit = 100;

  // Check if character limits are exceeded
  const isTitleInvalid = dashboardName.length > titleLimit;
  const isDescriptionInvalid = dashboardDescription.length > descriptionLimit;
  const isFormInvalid = isTitleInvalid || isDescriptionInvalid;

  const handleCreate = async () => {
    if (isFormInvalid) return;

    try {
      setLoading(true);

      if (!dashboardName.trim()) {
        toast.error("Dashboard name is required");
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

      if (response.status === 201) {
        toast.success("Dashboard successfully created!");
        onDashboardCreated?.();
      } else {
        toast.error("Failed to create dashboard");
      }
    } catch (error) {
      toast.error("Error occurred while creating dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <Typography color="blue-gray" className="text-xl mb-4 font-bold">
        Create New Dashboard
      </Typography>
      <Typography color="blue-gray" className="text-m mb-2">
        Dashboards are a collection of charts to help you organize your data
        visualisations.
      </Typography>
      <div className="space-y-4">
        {/* Dashboard Name Input */}
        <div className="w-full">
          <Textarea
            label="Dashboard Name"
            size="md"
            color="blue"
            onChange={(e) => setDashboardName(e.target.value)}
            value={dashboardName}
            disabled={isLoading}
            className={isTitleInvalid ? "border-red-500" : ""}
          />
          <div className="flex justify-between ml-2 text-sm">
            <span className={`${isTitleInvalid ? "text-red-500" : ""}`}>
              {dashboardName.length}/{titleLimit} characters
            </span>
            {isTitleInvalid && (
              <span className="text-red-500">Title too long!</span>
            )}
          </div>
        </div>

        {/* Description Input */}
        <div className="w-full">
          <Textarea
            label="Description (optional)"
            size="md"
            color="blue"
            onChange={(e) => setDashboardDescription(e.target.value)}
            value={dashboardDescription}
            disabled={isLoading}
            className={isDescriptionInvalid ? "border-red-500" : ""}
          />
          <div className="flex justify-between text-sm ml-2">
            <span
              className={`${isDescriptionInvalid ? "text-red-500" : ""} text-sm`}
            >
              {dashboardDescription.length}/{descriptionLimit} characters
            </span>
            {isDescriptionInvalid && (
              <span className="text-red-500">Description too long!</span>
            )}
          </div>
        </div>

        {/* Create and Cancel Buttons */}
        <Box className="flex justify-center space-x-5 mt-4 mb-4">
          <Button color="red" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            className="flex items-center justify-center"
            color="blue"
            onClick={handleCreate}
            disabled={isLoading || isFormInvalid}
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
                Creating...
              </>
            ) : (
              "Create Dashboard"
            )}
          </Button>
        </Box>
      </div>
    </div>
  );
}
