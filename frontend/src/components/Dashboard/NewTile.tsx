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
import { componentMapping } from "./ComponentMapping";

type ComponentKeys = keyof typeof componentMapping;

interface NewTileProps {
  onClose: () => void;
}

export default function NewTile({ onClose }: NewTileProps) {
  const [tileName, setTileName] = useState("");
  const [queryPrompt, setQueryPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState(false);
  const { dashboardId } = useParams();

  const [previewComponent, setPreviewComponent] = useState<string | null>(null);
  const [previewProps, setPreviewProps] = useState<any>(null);
  const [isPreviewGenerated, setIsPreviewGenerated] = useState(false);
  const [submitType, setSubmitType] = useState<"preview" | "save" | null>(null);
  const [apiData, setApiData] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tileName || tileName.trim() === "") {
      toast.error("Tile name is required!");
      return;
    }

    if (!queryPrompt || queryPrompt.trim() === "") {
      toast.error("Query prompt is required!");
      return;
    }

    setIsLoading(true);

    if (submitType === "preview") {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tile/`,
          {
            dash_id: dashboardId,
            title: tileName,
            description: queryPrompt,
          }
        );

        setPreviewComponent(response.data.component);
        setPreviewProps(response.data.tile_props);
        setIsPreviewGenerated(true);

        setApiData({
          dash_id: dashboardId,
          title: tileName,
          description: queryPrompt,
          ...response.data,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error generating preview:", error.response?.data.error);
          toast.error(error.response?.data.error);
        } else {
          console.error("Error generating preview:", error);
          toast.error("Failed to generate preview. Please try again.");
        }
      }
    } else if (submitType === "save") {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tile-save/`,
          apiData
        );
        toast.success("KPI saved successfully!");
        onClose();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error saving tile:", error.response?.data.error);
          toast.error(error.response?.data.error);
        } else {
          console.error("Error saving tile:", error);
          toast.error("Failed to save tile. Please try again.");
        }
      }
    }

    setIsLoading(false);
    setSubmitType(null);
  };

  const handleInfo = () => {
    setInfo(!info);
  };

  const PreviewComponent = previewComponent
    ? componentMapping[previewComponent as ComponentKeys]
    : null;

  return (
    <div className="p-6 bg-white rounded-md max-h-[80vh] overflow-y-auto">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Create New Tile
      </Typography>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="Enter query to generate the chart (e.g., 'Show me monthly sales data for the past year')"
            value={queryPrompt}
            onChange={(e) => setQueryPrompt(e.target.value)}
            rows={4}
            className="border border-gray-400 focus:border-blue-500 focus:ring-0 w-full min-h-[60px] rounded-md p-2"
          />
        </div>

        {PreviewComponent && previewProps && (
          <div className="mt-4 border rounded-lg p-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Preview
            </Typography>
            <PreviewComponent
              {...previewProps}
              title={tileName}
              description={queryPrompt}
            />
          </div>
        )}

        <Box className="flex justify-center space-x-5 mb-4">
          <Button color="red" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={() => setSubmitType("preview")}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Generating..." : "Generate Preview"}
          </Button>
          <Button
            color="green"
            onClick={() => setSubmitType("save")}
            disabled={!isPreviewGenerated || isLoading}
            type="submit"
          >
            Save
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
        <DialogHeader>Query Details</DialogHeader>
        <DialogBody>
          The data insights to be extracted from the uploaded data should be
          clearly specified. For optimal results, it is recommended to indicate
          the type of chart desired as well as the specific data for comparison.
          For example, when analyzing top players, it is important to define the
          metrics used to determine their ranking. An ideal specification could
          be to highlight the top players based on the number of gold medals
          they have won.
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