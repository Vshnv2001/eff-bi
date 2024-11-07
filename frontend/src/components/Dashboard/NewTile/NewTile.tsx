import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";
//import { useParams } from "react-router-dom";
import axios from "axios";
import { componentMapping, componentNames } from "../ComponentMapping";
import { SaveConfirmationDialog } from "./SaveConfirmationDialog";
import InfoTooltip from "./InfoTooltip";
import { TileForm } from "./TileForm";
import TableAccordion from "../../DataTable/TableAccordion";

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
  const [info, setInfo] = useState(false);
  //const { dashboardId } = useParams();

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
      toast.error("Visualization Instructions are required!");
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
    const message =
      saveType === "update"
        ? "Tile updated successfully!"
        : "New tile saved successfully!";
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

      const controller = new AbortController();
      const signal = controller.signal;

      const data = {
        dash_id: dashboardId,
        title: tileName,
        description: description,
      };

      // Step 1: Start streaming the SQL query immediately
      const stream = await generateStream(data);

      let fullSqlQuery = "";
      let previewData = {}; // Store the rest of the preview data
      for await (const chunk of stream) {
        console.log("chunk", chunk);
        // Check if this chunk is part of the SQL query
        if (chunk.sql_query) {
          console.log("if", chunk);
          fullSqlQuery += chunk.sql_query;
          //setSqlQuery(fullSqlQuery); // Update SQL query progressively
        } else {
          // Collect the other preview data (component, tile_props, etc.)
          console.log("else", chunk);
          setSqlQuery(chunk.sql_query);
          setPreviewComponent(chunk["component"]);
          console.log("component", previewComponent);
          setPreviewProps(chunk["tile_props"]);
          console.log("props", previewProps);
          setIsPreviewGenerated(true);
          setApiData({
            dash_id: dashboardId,
            title: tileName,
            description: description,
            ...chunk,
          });
        }
      }

      // Step 2: Set the remaining preview data after SQL query has been fully streamed
    } catch (error) {
      handleError(error);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  // Function to generate stream for SQL query
  const generateStream = async (data: any): Promise<AsyncIterable<any>> => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tile/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.status !== 200) throw new Error(response.status.toString());
    if (!response.body) throw new Error("Response body does not exist");

    return getIterableStream(response.body);
  };

  async function* getIterableStream(
    body: ReadableStream<Uint8Array>
  ): AsyncIterable<any> {
    const reader = body.getReader();
    const decoder = new TextDecoder();

    let buffer = ""; // Temporary buffer to accumulate streamed data

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      const decodedChunk = decoder.decode(value, { stream: true });
      buffer += decodedChunk;

      // If a chunk contains the complete SQL query or preview data, yield it
      if (buffer.includes("sql_query:")) {
        // If a SQL query is found, extract it
        const sqlQuery = extractSqlQuery(buffer); // Write a function to extract SQL query from buffer
        yield { sql_query: sqlQuery };
        buffer = buffer.replace(sqlQuery, ""); // Remove SQL query from buffer
      }

      // If there's any other data, yield it as preview data
      if (buffer.trim()) {
        const previewData = extractPreviewData(buffer); // Write a function to extract preview data
        yield previewData;
        buffer = ""; // Reset the buffer
      }
    }
  }

  // Helper function to extract SQL query from the buffer
  const extractSqlQuery = (buffer: string): string => {
    // Assuming SQL query is in the buffer and is clearly identified (you may need to adjust this logic based on your response format)
    const sqlQueryMatch = buffer.match(/sql_query:([^\n]*)/);
    return sqlQueryMatch ? sqlQueryMatch[1] : "";
  };

  // Helper function to extract preview data from the buffer
  const extractPreviewData = (buffer: string): any => {
    // Parse the buffer into JSON and return it (adjust this logic based on your response structure)
    try {
      return JSON.parse(buffer);
    } catch (error) {
      return {};
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
    let timer: NodeJS.Timeout | null = null;

    fetchTileData();

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [tileId, dashboardId, initialDataLoaded]);

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
          <div className="w-1/3 max-h-[75vh] overflow-y-auto border-r pr-4">
            <TableAccordion />
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
              handleInfo={handleInfo}
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
            />

            <SaveConfirmationDialog
              show={showSaveDialog}
              onCancel={handleCancel}
              onSave={() => handleSave("new")}
              onUpdate={() => handleSave("update")}
              isLoading={isLoading}
            />

            <InfoTooltip open={info} handler={handleInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}

/*
  const generatePreview = async () => {
    setIsLoading(true);

    const stream = await generateStream();
    for await (const chunk of stream) {
      console.log(chunk);
    }

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
  */
