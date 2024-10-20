import React, { useState } from "react";
import { Typography, Input, Textarea, Button } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import axios from "axios";

interface NewTileProps {
  onClose: () => void;
}

export default function NewTile({ onClose }: NewTileProps) {
  const [tileName, setTileName] = useState("");
  const [tileDescription, setTileDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
          description: tileDescription,
        }
      );

      console.log(response.data);
      setTileName("");
      setTileDescription("");
      toast.success("KPI generated successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating new tile:", error);
      toast.error("Failed to create new tile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Create New Tile
      </Typography>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Tile Name
          </Typography>
          <Input
            size="lg"
            placeholder="Enter tile name"
            crossOrigin={undefined}
            value={tileName}
            onChange={(e) => setTileName(e.target.value)}
          />
        </div>

        <div>
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Tile Description
          </Typography>
          <Textarea
            size="lg"
            placeholder="Enter tile description"
            value={tileDescription}
            onChange={(e) => setTileDescription(e.target.value)}
            rows={4}
            className="required-border"
          />
        </div>

        <Box className="flex justify-center gap-2 mb-2">
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
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
    </div>
  );
}
