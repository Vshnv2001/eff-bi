import React, { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import axios from "axios";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";

interface NewTileProps {
  onClose: () => void;
}

export default function NewTile({ onClose }: NewTileProps) {
  const [tileName, setTileName] = useState("");
  const [queryPrompt, setQueryPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState(false);
  const { dashboardId } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tile/`,
        {
          dash_id: dashboardId,
          title: tileName,
          description: queryPrompt,
        }
      );

      console.log(response.data);
      setTileName("");
      setQueryPrompt("");
      toast.success("KPI generated successfully!");
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating new tile:", error.response?.data.error);
        toast.error(error.response?.data.error);
      } else {
        console.error("Error creating new tile:", error);
        toast.error("Failed to create new tile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfo = () => {
    setInfo(!info);
  };

  return (
    <div className="p-6 bg-white rounded-md">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Create New Tile
      </Typography>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="relative mb-4">
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Tile Name
            </Typography>
            <textarea
              placeholder="Enter tile name"
              value={tileName}
              onChange={(e) => setTileName(e.target.value)}
              className="border border-gray-400 focus:border-blue-500 focus:ring-0 w-full min-h-[60px] rounded-md p-2"
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Typography variant="h6" color="blue-gray" className="mr-2">
                Query Prompt
              </Typography>
              <IconButton
                variant="text"
                className="w-5 h-5 p-0"
                onClick={handleInfo}
              >
                <InformationCircleIcon className="h-5 w-5" />
              </IconButton>
            </div>
            <div className="relative">
              <textarea
                placeholder="Enter query to generate the chart (e.g., 'Show me monthly sales data for the past year"
                value={queryPrompt}
                onChange={(e) => setQueryPrompt(e.target.value)}
                rows={4}
                className="border border-gray-400 focus:border-blue-500 focus:ring-0 w-full min-h-[60px] rounded-md p-2"
              />
            </div>
          </div>
        </div>

        <Box className="flex justify-center space-x-5 mb-4">
          <Button color="red" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="blue"
            disabled={isLoading}
            className="flex items-center justify-center"
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
              "Generate"
            )}
          </Button>
        </Box>
      </form>

      <ToastContainer
        className="pt-14"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />

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
    </div>
  );
}
