import React from 'react';
import { Typography, IconButton } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ChartPreferences } from "./ChartPreferences";
import { ActionButtons } from "./ActionButtons";

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
}) => {
  return (
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

      <ChartPreferences
        componentNames={componentNames}
        selectedTemplates={selectedTemplates}
        setSelectedTemplates={setSelectedTemplates}
      />

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
          <SyntaxHighlighter
            language="sql"
            className="w-full rounded-lg h-full"
            wrapLines={true}
            lineProps={{ style: { whiteSpace: "pre-wrap" } }}
          >
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

      <ActionButtons
        onClose={onClose}
        setSubmitType={setSubmitType}
        isLoading={isLoading}
        isPreviewGenerated={isPreviewGenerated}
      />
    </form>
  );
};