import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";
import axios from "axios";
import { componentMapping, componentNames } from "../ComponentMapping";
import { SaveConfirmationDialog } from "./SaveConfirmationDialog";
import { TileForm } from "./TileForm";
import ColumnAccordion from "../../DataTable/ColumnAccordion";

type ComponentKeys = keyof typeof componentMapping;
type SaveType = "update" | "new";

interface NewTileProps {
  onClose: () => void;
  onSaveSuccess: (message: string) => void;
  tileId?: number | null;
  dashboardId?: number | null;
}

export default function NewTile({
  onClose,
  onSaveSuccess,
  tileId,
  dashboardId,
}: NewTileProps) {
  const [tileName, setTileName] = useState("");
  const [queryPrompt, setQueryPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [previewComponent, setPreviewComponent] = useState<string | null>(null);
  const [previewProps, setPreviewProps] = useState<any>(null);
  const [isPreviewGenerated, setIsPreviewGenerated] = useState(false);
  const [submitType, setSubmitType] = useState<"preview" | "save" | null>(null);
  const [apiData, setApiData] = useState<any>({});
  const [sqlQuery, setSqlQuery] = useState<string>("");
  const [previewText, setPreviewText] = useState<string>("");
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [progress, setProgress] = useState(0);

  console.log("tileId", tileId);

  // Generate random preview text variations
  const generatePreviewText = () => {
    const templates = [
      `Verifying access to the tables and columns required to generate the visualization for your provided query prompt: "${queryPrompt}".`,
      `Conducting a pre-check to verify that all necessary tables and fields are accessible for the query: "${queryPrompt}".`,
      `Confirming access to the essential tables before generating a visualization based on your query prompt: "${queryPrompt}".`,
      `Before generating the query, we are checking permissions on your dataset to ensure all necessary tables are accessible for the query prompt: "${queryPrompt}".`,
      `To generate the requested visualization for the query prompt: "${queryPrompt}", we need to confirm that all required data sources are accessible.`,
      `Performing an access validation check on the tables needed for the query prompt: "${queryPrompt}".`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    fetchTileData();

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [tileId, dashboardId, initialDataLoaded]);

  const validateForm = () => {
    if (!tileName || tileName.trim() === "") {
      toast.error("Chart name is required!");
      return false;
    }
    if (!queryPrompt || queryPrompt.trim() === "") {
      toast.error("Visualization Instructions are required!");
      return false;
    }

    if (tileName.length > 50) {
      toast.error("Chart name has to be less than 50 characters!");
      return false;
    }
    return true;
  };

  const showSuccessToast = (saveType: SaveType) => {
    const message =
      saveType === "update"
        ? "Chart updated successfully!"
        : "New chart saved successfully!";
    onSaveSuccess(message);
  };

  const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      console.error("Error:", error.response?.data.error);
      toast.error(error.response?.data.error, {
        autoClose: 10000,
      });
    } else {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleFetchError = (error: any) => {
    toast.error(error, {
      autoClose: 10000,
    });
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

  // TODO: Possibly update to newSqlQuery if it is not empty
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

  const generatePreview = async () => {
    setIsLoading(true);
    setSqlQuery("");
    setPreviewComponent(null);
    setPreviewProps(null);
    setPreviewText("");

    let description = queryPrompt;
    try {
      if (selectedTemplates.length > 0) {
        const componentNamesString = selectedTemplates.join(",");
        description = `${queryPrompt}\n\nTry to generate a chart that is any of the following: ${componentNamesString}.`;
      }

      setPreviewText(generatePreviewText());

      const stream = await generateStream(description);

      for await (const chunk of stream) {
        try {
          const chunkData: ChunkData = JSON.parse(chunk);

          // console.log("chunk data", chunkData);

          if (chunkData.error) {
            setIsPreviewGenerated(false);
            handleFetchError(chunkData.error);
            return;
          }

          if (chunkData.sql) {
            // console.log("SQL Query:", chunkData.sql);
            setSqlQuery(chunkData.sql);
          } else {
            // console.log("Other Data:", chunkData);
            setApiData({
              ...chunkData,
            });
            setPreviewComponent(chunkData.component);
            setPreviewProps(chunkData.tile_props);
          }
        } catch (error) {
          setIsPreviewGenerated(false);
          console.error("Error parsing chunk data:", error);
        }
      }

      setIsPreviewGenerated(true);
      console.log("preview generated", isPreviewGenerated, previewComponent);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  interface ChunkData {
    sql_query?: string;
    [key: string]: any;
  }

  const generateStream = async (
    description: string
  ): Promise<AsyncIterable<string>> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 60000);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tile/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dash_id: dashboardId,
            title: tileName,
            description: description,
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (!response.body) {
        throw new Error("Response body does not exist");
      }

      return getIterableStream(response.body);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          handleFetchError("Unable to generate chart. Request took too long.");
        } else {
          handleFetchError(`Error: ${error.message}`);
        }
      } else {
        handleFetchError("An unknown error occurred.");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  async function* getIterableStream(
    body: ReadableStream<Uint8Array>
  ): AsyncIterable<string> {
    const reader = body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const decodedChunk = decoder.decode(value, { stream: true });
      yield decodedChunk;
    }
  }

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
        console.error("Error parsing chart props:", error);
      }
    }
    setPreviewProps(parsedProps);

    setApiData({
      dash_id: dashboardId,
      tile_props: parsedProps,
      ...tileData,
    });

    setIsPreviewGenerated(true);
    console.log("preview generated", isPreviewGenerated);
    setInitialDataLoaded(true);
  };

  const handleSave = async (saveType: SaveType) => {
    if (!validateForm()) return;

    setIsLoading(true);
    const { cancelToken, timeout } = setupCancelToken("Request took too long.");

    try {
      const endpoint = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/dashboard-tile-save/`;
      const method = saveType === "update" ? "put" : "post";
      let apiDataToSend = getApiDataToSend(saveType);

      if (method === "put") {
        apiDataToSend.id = tileId;
      }

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
    //setSubmitType(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) =>
    e.stopPropagation();
  const handleCancel = () => setShowSaveDialog(false);

  const PreviewComponent =
    previewComponent && componentMapping[previewComponent as ComponentKeys]
      ? componentMapping[previewComponent as ComponentKeys]
      : null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        className="p-6 bg-white rounded-md max-h-[85vh] overflow-y-auto w-full max-w-4xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="h4" color="blue-gray" className="mb-4 text-center">
          {tileId ? "Edit Chart" : "Create New Chart"}
        </Typography>

        <div className="flex space-x-6">
          {" "}
          <div className="w-1/3 overflow-y-auto pr-4 border-r">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-4 text-center"
            >
              Table Columns
            </Typography>
            <ColumnAccordion />
          </div>
          <div className="w-2/3">
            <TileForm
              tileName={tileName}
              setTileName={setTileName}
              queryPrompt={queryPrompt}
              setQueryPrompt={setQueryPrompt}
              componentNames={componentNames}
              selectedTemplates={selectedTemplates}
              setSelectedTemplates={setSelectedTemplates}
              sqlQuery={sqlQuery}
              PreviewComponent={PreviewComponent}
              previewProps={previewProps}
              onClose={onClose}
              setSubmitType={setSubmitType}
              isLoading={isLoading}
              isPreviewGenerated={isPreviewGenerated}
              handleSubmit={handleSubmit}
              submitType={submitType}
              progress={progress}
              setProgress={setProgress}
              previewText={previewText}
            />

            <SaveConfirmationDialog
              show={showSaveDialog}
              onCancel={handleCancel}
              onSave={() => handleSave("new")}
              onUpdate={() => handleSave("update")}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
