import React, { useEffect, useState } from "react";
import { Typography, IconButton } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ChartPreferences } from "./ChartPreferences";
import { ActionButtons } from "./ActionButtons";
import LinearProgressWithLabel from "../LinearProgressWithLabel";
import { Box } from "@mui/material";
import TypewriterEffect from "./TypewriterEffect";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface TileFormProps {
  tileName: string;
  setTileName: (name: string) => void;
  queryPrompt: string;
  setQueryPrompt: (prompt: string) => void;
  componentNames: Record<string, string>;
  selectedTemplates: string[];
  setSelectedTemplates: React.Dispatch<React.SetStateAction<string[]>>;
  handleInfo: () => void;
  sqlQuery: string;
  PreviewComponent: React.ComponentType<any> | null;
  previewProps: any;
  onClose: () => void;
  setSubmitType: (type: "preview" | "save" | null) => void;
  isLoading: boolean;
  isPreviewGenerated: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  progress: number;
  submitType: string | null;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

export const TileForm: React.FC<TileFormProps> = ({
  tileName,
  setTileName,
  queryPrompt,
  setQueryPrompt,
  componentNames,
  selectedTemplates,
  setSelectedTemplates,
  handleInfo,
  sqlQuery,
  PreviewComponent,
  previewProps,
  onClose,
  setSubmitType,
  isLoading,
  isPreviewGenerated,
  handleSubmit,
  progress,
  setProgress,
  submitType,
}) => {
  const [previewText, setPreviewText] = useState("");

  // Generate random preview text variations
  const generatePreviewText = () => {
    const templates = [
      `To generate the SQL query and corresponding visualization for your prompt: "${queryPrompt}", we will first assess your access rights to the necessary tables and columns.`,
      `Before we proceed with the visualization for the query: "${queryPrompt}", we need to validate access to the relevant datasets.`,
      `Verifying access to the tables and columns required to generate the visualization for your provided query prompt: "${queryPrompt}".`,
      `In order to craft a visualization, we are ensuring you have the correct permissions to access all required tables and data points.`,
      `Conducting a pre-check to verify that all necessary tables and fields are accessible for the query: "${queryPrompt}".`,
      `We are confirming access to the essential tables before generating a visualization based on your query prompt: "${queryPrompt}".`,
      `To ensure a seamless experience, we are currently validating your access to the necessary data for the query prompt: "${queryPrompt}".`,
      `Before generating the query, we are checking permissions on your dataset to ensure all necessary tables are accessible for the query prompt: "${queryPrompt}".`,
      `To generate the requested visualization for the query prompt: "${queryPrompt}", we need to confirm that all required data sources are accessible.`,
      `Performing an access validation check on the tables needed for the query prompt: "${queryPrompt}".`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  };

  useEffect(() => {
    if (submitType === "preview") {
      setPreviewText(generatePreviewText());
    }
  }, [submitType, queryPrompt]);

  // Progress bar management
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

    return () => clearInterval(timer);
  }, [isLoading, progress]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-3">
      {/* Tile Name */}
      <div className="relative mb-4">
        <Typography variant="h6" color="blue-gray">
          Tile Name
        </Typography>
        <textarea
          placeholder="Enter tile name"
          value={tileName}
          onChange={(e) => setTileName(e.target.value)}
          className="border border-gray-400 focus:border-blue-500 focus:ring-0 w-full min-h-[60px] rounded-md p-2"
        />
      </div>

      {/* Chart Preferences */}
      <ChartPreferences
        componentNames={componentNames}
        selectedTemplates={selectedTemplates}
        setSelectedTemplates={setSelectedTemplates}
      />

      {/* Visualization Instructions */}
      <div>
        <div className="flex items-center">
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
        <textarea
          placeholder="Enter your query for generating the chart (e.g., 'Display monthly revenue trends over the last year')"
          value={queryPrompt}
          onChange={(e) => setQueryPrompt(e.target.value)}
          rows={4}
          className="border border-gray-400 focus:border-blue-500 focus:ring-0 w-full min-h-[60px] rounded-md p-2"
        />
      </div>

      {/* Display Query Generation Process */}
      <div className="mt-4 mb-4">
        <Typography variant="h6" color="blue-gray" className="mb-1">
          Query Generation Process
        </Typography>
        {submitType === "preview" ? (
          // Show typewriter effect for both previewText and sqlQuery
          <TypewriterEffect
            previewText={previewText}
            sqlQuery={sqlQuery}
            speed={30}
            showFullText={false}
          />
        ) : (
          // Display sqlQuery in its entirety without typewriter effect

          <SyntaxHighlighter
            language="sql"
            className="w-full rounded-lg"
            wrapLines={true}
            lineProps={{ style: { whiteSpace: "pre-wrap" } }}
          >
            {sqlQuery}
          </SyntaxHighlighter>
        )}
      </div>

      {/* Preview Component */}
      {PreviewComponent && previewProps && (
        <div className="mt-4 border rounded-lg p-4">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Preview
          </Typography>
          <PreviewComponent {...previewProps} />
        </div>
      )}

      {/* Progress Bar */}
      {isLoading && (
        <Box className="mt-4">
          <LinearProgressWithLabel value={progress} />
        </Box>
      )}

      {/* Action Buttons */}
      <ActionButtons
        onClose={onClose}
        setSubmitType={setSubmitType}
        isLoading={isLoading}
        isPreviewGenerated={isPreviewGenerated}
      />
    </form>
  );
};
