import React, { useState, useEffect } from "react";
import { Typography, Button, Spinner } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Box, Chip } from "@mui/material";
import axios, { CancelTokenSource } from "axios";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";
import { componentMapping, componentNames } from "./ComponentMapping";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

type ComponentKeys = keyof typeof componentMapping;

interface NewTileProps {
  onClose: () => void;
  tileId?: number | null;
}

export default function NewTile({ onClose, tileId }: NewTileProps) {
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
  const [sqlQuery, setSqlQuery] = useState<string>("");
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Helper functions begin
  const validateForm = () => {
    if (!tileName || tileName.trim() === "") {
      toast.error("Tile name is required!");
      return false;
    }

    if (!queryPrompt || queryPrompt.trim() === "") {
      toast.error("Visualization Instructions are required!");
      return false;
    }

    return true;
  };

  const getApiDataToSend = (saveType: "update" | "new") => {
    return saveType === "update"
      ? {
          ...apiData,
          title: tileName,
          description: queryPrompt,
          sql_query: sqlQuery,
          tile_props: previewProps,
        }
      : {
          ...apiData,
          title: tileName,
          description: queryPrompt,
          sql_query: sqlQuery,
          tile_props: previewProps,
          id: undefined,
        };
  };

  const showSuccessToast = (saveType: "update" | "new") => {
    toast.success(
      saveType === "update"
        ? "Tile updated successfully!"
        : "New tile saved successfully!"
    );
  };

  const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      console.error("Error:", error.response?.data.error);
      toast.error(error.response?.data.error);
    } else {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const generatePreview = async () => {
    setIsLoading(true);
    let cancelToken: CancelTokenSource | undefined;
    const timeout = setTimeout(() => {
      if (cancelToken) {
        const cancelReason = "Unable to generate tile. Request took too long.";
        cancelToken.cancel(cancelReason);
        toast.error(cancelReason);
        setIsLoading(false);
      }
    }, 60000);

    let description = queryPrompt;
    try {
      let componentNamesString;
      if (selectedTemplates.length > 0) {
        componentNamesString = selectedTemplates.join(",");
        description = `${queryPrompt}\n\nTry to generate a chart that is any of the following: ${componentNamesString}.`;
      }
      cancelToken = axios.CancelToken.source();

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tile/`,
        {
          dash_id: dashboardId,
          title: tileName,
          description: description,
        },
        { cancelToken: cancelToken.token }
      );

      setPreviewComponent(response.data.component);
      setPreviewProps(response.data.tile_props);
      setSqlQuery(response.data.sql_query);
      setIsPreviewGenerated(true);
      clearTimeout(timeout);

      setApiData({
        dash_id: dashboardId,
        title: tileName,
        description: description,
        ...response.data,
      });
    } catch (error) {
      clearTimeout(timeout);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Helper functions end

  useEffect(() => {
    const fetchTileData = async () => {
      if (tileId && !initialDataLoaded) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/dashboard-tiles/${tileId}/`,
            {
              params: { dash_id: dashboardId },
            }
          );

          const tileData = response.data.data;

          setTileName(tileData.title);
          setQueryPrompt(tileData.description);
          setSqlQuery(tileData.sql_query);
          setPreviewComponent(tileData.component);

          let parsedProps = tileData.tile_props;
          if (typeof tileData.tile_props === "string") {
            try {
              parsedProps = JSON.parse(tileData.tile_props);
            } catch (error) {
              console.error("Error parsing tile props:", error);
            }
          }
          setPreviewProps(parsedProps);

          setApiData({
            dash_id: dashboardId,
            tile_props: parsedProps,
            ...tileData,
          });

          setIsPreviewGenerated(true);
          setInitialDataLoaded(true);
        } catch (error) {
          handleError(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTileData();
  }, [tileId, dashboardId, initialDataLoaded]);

  const handleSave = async (saveType: "update" | "new") => {
    setIsLoading(true);
    let cancelToken: CancelTokenSource | undefined;
    const timeout = setTimeout(() => {
      if (cancelToken) {
        const cancelReason = "Request took too long.";
        cancelToken.cancel(cancelReason);
        toast.error(cancelReason);
        setIsLoading(false);
      }
    }, 60000);

    try {
      cancelToken = axios.CancelToken.source();

      const endpoint = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/dashboard-tile-save/`;
      const method = saveType === "update" ? "put" : "post";

      if (!validateForm()) return;

      const apiDataToSend = getApiDataToSend(saveType);

      await axios({
        method,
        url: endpoint,
        data: apiDataToSend,
        cancelToken: cancelToken.token,
      });

      showSuccessToast(saveType);
      clearTimeout(timeout);
      onClose();
    } catch (error) {
      clearTimeout(timeout);
      handleError(error);
    } finally {
      setIsLoading(false);
      setShowSaveDialog(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (submitType === "preview") {
      await generatePreview();
    } else if (submitType === "save") {
      if (tileId) {
        setShowSaveDialog(true);
      } else {
        handleSave("new");
      }
    }
    setSubmitType(null);
  };

  const handleInfo = () => {
    setInfo((prevInfo) => !prevInfo);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const PreviewComponent = previewComponent
    ? componentMapping[previewComponent as ComponentKeys]
    : null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        className="p-6 bg-white rounded-md max-h-[80vh] overflow-y-auto w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="h4" color="blue-gray" className="mb-4">
          {tileId ? "Edit Tile" : "Create New Tile"}
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

          <div className="relative mb-4">
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Chart Preferences (Optional)
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {Object.keys(componentNames).map((component) => (
                <Chip
                  key={component}
                  label={component}
                  onClick={() => {
                    setSelectedTemplates((prev) =>
                      prev.includes(component)
                        ? prev.filter((item) => item !== component)
                        : [...prev, component]
                    );
                  }}
                  color={
                    selectedTemplates.includes(component)
                      ? "primary"
                      : "default"
                  }
                />
              ))}
            </Box>
          </div>

          {info && (
            <div className="absolute z-10 p-4 bg-white border rounded-lg shadow-2xl w-[39rem]">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Visualization Details
              </Typography>
              <Typography color="gray">
                For optimal results, it is recommended to indicate the type of
                chart desired as well as the specific data for comparison. When
                defining specific conditions,{" "}
                <span className="text-red-500 font-bold">
                  always use precise values in conditions
                </span>
                . For example, if the condition is "injury," do not substitute
                with synonyms or related terms like "injured" or "torn
                hamstring."
                <br />
                <br />
                Ensure that the conditions match exactly what is recorded in the
                dataset to avoid discrepancies in the analysis. It is also
                important to clarify the metrics used to define vague terms. For
                instance, an ideal specification could highlight the top players
                based on the number of gold medals they have won.
              </Typography>
              <Button variant="filled" onClick={handleInfo} className="mt-5">
                Close
              </Button>
            </div>
          )}

          <div className="flex items-center mb-2">
            <Typography variant="h6" color="blue-gray" className="mr-2">
              Visualization Instructions
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

          {sqlQuery && (
            <div className="relative mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-1">
                SQL Query
              </Typography>
              <SyntaxHighlighter language="sql" className="w-full rounded-lg">
                {sqlQuery}
              </SyntaxHighlighter>
            </div>
          )}

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
            <Button color="red" onClick={onClose}>
              Cancel
            </Button>
            <Button
              color="blue"
              onClick={() => setSubmitType("preview")}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <span>Generating...</span>
                  <Spinner className="h-5 w-5 ml-2 animate-spin" />
                </div>
              ) : (
                "Generate Preview"
              )}
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

        {/* Save Confirmation Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-4 text-center"
              >
                Save Options
              </Typography>
              <Typography color="gray" className="mb-6">
                Would you like to update the existing chart or save as a new
                chart?
              </Typography>

              <Box className="flex justify-center space-x-5 mb-4">
                <Button
                  color="red"
                  onClick={() => setShowSaveDialog(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  color="blue"
                  onClick={() => handleSave("new")}
                  disabled={isLoading}
                >
                  Save
                </Button>
                <Button
                  color="green"
                  onClick={() => handleSave("update")}
                  disabled={isLoading}
                >
                  Update
                </Button>
              </Box>
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
}
