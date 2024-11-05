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
  navigateToData,
}: {
  open: boolean;
  onClose: () => void;
  navigateToData: () => void;
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
        The Database URI is required for EFF BI to connect to your database. <br/>
          Please configure your database settings in the Data Page or check with your organization's administrator.
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
            onClick={navigateToData}
          >
            Go to Data Page
          </Button>
        </Box>
      </DialogBody>
    </Dialog>
  );
}
