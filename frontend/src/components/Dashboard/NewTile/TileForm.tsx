import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";
import { ChartPreferences } from "./ChartPreferences";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
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
  previewText: string;
}

export const TileForm: React.FC<TileFormProps> = ({
  tileName,
  setTileName,
  queryPrompt,
  setQueryPrompt,
  componentNames,
  selectedTemplates,
  setSelectedTemplates,
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
  previewText,
}) => {
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

  const maxLength = 50;

  const isExceeded = tileName.length > maxLength;

  const [openAccordions, setOpenAccordions] = useState<number[]>([]);

  // Toggle function to open/close the accordion
  const handleOpen = (index: number) => {
    if (openAccordions.includes(index)) {
      setOpenAccordions(openAccordions.filter((i: number) => i !== index));
    } else {
      setOpenAccordions([...openAccordions, index]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-3">
      {/* Chart Name */}
      <div className="relative mb-4">
        <Typography variant="h6" color="blue-gray">
          Chart Name
        </Typography>
        <textarea
          placeholder="Enter chart name"
          value={tileName}
          onChange={(e) => setTileName(e.target.value)}
          className={`border ${isExceeded ? "border-red-500" : "border-gray-400"} focus:border-blue-500 focus:ring-0 w-full min-h-[60px] rounded-md p-2`}
        />
        <div className="flex justify-between mt-2">
          <Typography color={isExceeded ? "red" : "gray"}>
            {tileName.length} / {maxLength} characters
          </Typography>
          {isExceeded && (
            <Typography color="red" className="text-sm">
              Character limit exceeded
            </Typography>
          )}
        </div>
      </div>

      {/* Chart Preferences */}
      <ChartPreferences
        componentNames={componentNames}
        selectedTemplates={selectedTemplates}
        setSelectedTemplates={setSelectedTemplates}
      />

      {/* Accordion Section */}
      <Accordion open={openAccordions.includes(0)} className="mb-4">
        <AccordionHeader
          onClick={() => handleOpen(0)}
          className={`flex items-center justify-between w-full p-0 cursor-pointer rounded-lg duration-200`}
        >
          {/* Accordion Header */}
          <div className="flex items-center overflow-x-auto flex-grow">
            <InformationCircleIcon className="h-5 w-5 mr-1" />
            <Typography variant="h6" color="blue-gray">
              Visualization Information
            </Typography>
          </div>
          {/* Accordion Icon */}
          <div
            className={`transform transition-transform duration-300 ${
              openAccordions.includes(0) ? "rotate-180" : "rotate-0"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </div>
        </AccordionHeader>

        {/* Accordion Body */}
        <AccordionBody className="pt-2">
          <Typography color="gray">
            For optimal results, it is recommended to indicate the type of chart
            desired as well as the specific data for comparison. When defining
            specific data,{" "}
            <span className="text-blue-500 font-bold">
              always use precise values in conditions
            </span>
            . For example, if the condition is "injury," do not substitute with
            synonyms or related terms like "injured" or "torn hamstring."
          </Typography>
        </AccordionBody>
      </Accordion>

      {/* Visualization Instructions */}
      <div>
        <div className="flex items-center">
          <Typography variant="h6" color="blue-gray" className="mr-2">
            Visualization Instructions
          </Typography>
        </div>
        <textarea
          placeholder="Enter your query for generating the chart (e.g., 'Show me the percentage of riders who exit and did not exit the race in a pie chart')"
          value={queryPrompt}
          onChange={(e) => setQueryPrompt(e.target.value)}
          rows={4}
          className="border border-gray-400 focus:border-blue-500 focus:ring-0 w-full min-h-[60px] rounded-md p-2"
        />
      </div>

      {/* Display Output */}
      <div className="mt-4 mb-4">
        <Typography variant="h6" color="blue-gray" className="mb-1">
          Output
        </Typography>

        {submitType === "preview" ? (
          // Show typewriter effect for both previewText and sqlQuery
          <TypewriterEffect
            previewText={previewText}
            sqlQuery={sqlQuery}
            speed={PreviewComponent && previewProps ? 2 : 20}
            showFullText={PreviewComponent && previewProps ? true : false}
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

        {/* Preview Component */}
        {PreviewComponent && previewProps && (
          <div className="mt-4 border rounded-lg p-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Preview
            </Typography>
            <PreviewComponent {...previewProps} />
          </div>
        )}
      </div>

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
