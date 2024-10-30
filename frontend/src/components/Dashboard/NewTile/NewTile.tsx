import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
import { componentMapping, componentNames } from "../ComponentMapping";
import { SaveConfirmationDialog } from "./SaveConfirmationDialog";
import InfoTooltip from "./InfoTooltip";
import { TileForm } from "./TileForm";
import LinearProgressWithLabel from "../LinearProgressWithLabel";
import { Box } from "@mui/material";

type ComponentKeys = keyof typeof componentMapping;
type SaveType = "update" | "new";

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
  const [progress, setProgress] = useState(0);

  const validateForm = () => {
    if (!tileName || tileName.trim() === "") {
      toast.error("Tile name is required!");
      return false;
    }
    if (!queryPrompt || queryPrompt.trim() === "") {
      toast.error("Query prompt is required!");
      return false;
    }
    return true;
  };

  const getApiDataToSend = (saveType: SaveType) => {
    const baseData = {
      ...apiData,
      title: tileName,
      description: queryPrompt,
      sql_query: sqlQuery,
      tile_props: previewProps,
    };
    return saveType === "update" ? baseData : { ...baseData, id: undefined };
  };

  const showSuccessToast = (saveType: SaveType) => {
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

  const setupCancelToken = (timeoutMessage: string) => {
    const cancelToken = axios.CancelToken.source();
    const timeout = setTimeout(() => {
      if (cancelToken) {
        cancelToken.cancel(timeoutMessage);
        toast.error(timeoutMessage);
        setIsLoading(false);
      }
    }, 60000);
    return { cancelToken, timeout };
  };

  const generatePreview = async () => {
    setIsLoading(true);
    const { cancelToken, timeout } = setupCancelToken(
      "Unable to generate tile. Request took too long."
    );

    let description = queryPrompt;
    try {
      if (selectedTemplates.length > 0) {
        const componentNamesString = selectedTemplates.join(",");
        description = `${queryPrompt}\n\nTry to generate a chart that is any of the following: ${componentNamesString}.`;
      }

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
      setApiData({
        dash_id: dashboardId,
        title: tileName,
        description: description,
        ...response.data,
      });
    } catch (error) {
      handleError(error);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  const processTileData = (tileData: any) => {
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
  };

  const fetchTileData = async () => {
    if (tileId && !initialDataLoaded) {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tiles/${tileId}/`,
          { params: { dash_id: dashboardId } }
        );
        processTileData(response.data.data);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      if (progress < 90) {
        timer = setInterval(() => {
          setProgress((prevProgress) =>
            prevProgress >= 100 ? 100 : prevProgress + 1.25
          );
        }, 150);
      } else if (progress < 98) {
        timer = setInterval(() => {
          setProgress((prevProgress) =>
            prevProgress >= 100 ? 100 : prevProgress + 1
          );
        }, 1000);
      }
    }

    fetchTileData();

    return () => clearInterval(timer);
  }, [isLoading, progress, tileId, dashboardId, initialDataLoaded]);

  const handleSave = async (saveType: SaveType) => {
    if (!validateForm()) return;

    setIsLoading(true);
    const { cancelToken, timeout } = setupCancelToken("Request took too long.");

    try {
      const endpoint = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/dashboard-tile-save/`;
      const method = saveType === "update" ? "put" : "post";
      const apiDataToSend = getApiDataToSend(saveType);

      await axios({
        method,
        url: endpoint,
        data: apiDataToSend,
        cancelToken: cancelToken.token,
      });

      showSuccessToast(saveType);
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
      setShowSaveDialog(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (submitType === "preview") {
      setProgress(0);
      await generatePreview();
    } else if (submitType === "save") {
      tileId ? setShowSaveDialog(true) : handleSave("new");
    }
    setSubmitType(null);
  };

  const handleInfo = () => setInfo((prevInfo) => !prevInfo);
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) =>
    e.stopPropagation();
  const handleCancel = () => setShowSaveDialog(false);

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

        <TileForm
          tileName={tileName}
          setTileName={setTileName}
          queryPrompt={queryPrompt}
          setQueryPrompt={setQueryPrompt}
          componentNames={componentNames}
          selectedTemplates={selectedTemplates}
          setSelectedTemplates={setSelectedTemplates}
          handleInfo={handleInfo}
          sqlQuery={sqlQuery}
          PreviewComponent={PreviewComponent}
          previewProps={previewProps}
          onClose={onClose}
          setSubmitType={setSubmitType}
          isLoading={isLoading}
          isPreviewGenerated={isPreviewGenerated}
          handleSubmit={handleSubmit}
        />

        {isLoading && submitType === "preview" && (
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={progress} />
          </Box>
        )}

        <SaveConfirmationDialog
          show={showSaveDialog}
          onCancel={handleCancel}
          onSave={() => handleSave("new")}
          onUpdate={() => handleSave("update")}
          isLoading={isLoading}
        />

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

        <InfoTooltip open={info} handler={handleInfo} />
      </div>
    </div>
  );
}
