import React from "react";
import { Button, Spinner } from "@material-tailwind/react";
import { Box } from "@mui/material";

interface ActionButtonsProps {
  onClose: () => void;
  setSubmitType: (type: "preview" | "save") => void;
  isLoading: boolean;
  isPreviewGenerated: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onClose,
  setSubmitType,
  isLoading,
  isPreviewGenerated,
}) => {
  return (
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
  );
};
