import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { Box } from "@mui/material";

interface SaveConfirmationDialogProps {
  show: boolean;
  onCancel: () => void;
  onSave: () => void;
  onUpdate: () => void;
  isLoading: boolean;
}

export const SaveConfirmationDialog: React.FC<SaveConfirmationDialogProps> = ({
  show,
  onCancel,
  onSave,
  onUpdate,
  isLoading,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <Typography variant="h5" color="blue-gray" className="mb-4 text-center">
          Save Options
        </Typography>
        <Typography color="gray" className="mb-6">
          Would you like to update the existing chart or save as a new chart?
        </Typography>

        <Box className="flex justify-center space-x-5 mb-4">
          <Button color="red" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="blue" onClick={onUpdate} disabled={isLoading}>
            Update
          </Button>
          <Button color="green" onClick={onSave} disabled={isLoading}>
            Save
          </Button>
        </Box>
      </div>
    </div>
  );
};
