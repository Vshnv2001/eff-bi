import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
} from "@material-tailwind/react";
import { Box } from "@mui/material";

export default function NotificationDialog({
  open,
  onClose,
  navigateToSettings,
}: {
  open: boolean;
  onClose: () => void;
  navigateToSettings: () => void;
}) {
  return (
    <Dialog open={open} handler={onClose} className="max-w-sm mx-auto">
      <DialogHeader>
        <Typography variant="h5" color="blue-gray">
          Database Configuration Needed
        </Typography>
      </DialogHeader>
      <DialogBody divider className="grid place-items-center gap-4">
        <Typography color="red" variant="h4">
          Database URI Missing!
        </Typography>
        <Typography className="text-center font-normal">
          Please configure your database settings by visiting the settings page.
        </Typography>
        <Box className="w-full flex justify-center gap-4 mb-4 mt-4">
          <Button
            type="submit"
            color="red"
            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="submit"
            color="blue"
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
            onClick={navigateToSettings}
          >
            Go to Settings
          </Button>
        </Box>
      </DialogBody>
    </Dialog>
  );
}
