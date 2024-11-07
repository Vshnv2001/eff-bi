import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
} from "@material-tailwind/react";
import {Alert, Box, IconButton} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import CancelIcon from '@mui/icons-material/Cancel';
export default function NotificationDialog({
  open,
  onClose,
  navigateToData,
}: {
  open: boolean;
  onClose: () => void;
  navigateToData: () => void;
}) {
  const handleCopyMockData = () => {
    navigator.clipboard.writeText(
      "postgres://view_user:testeffbi@pg-effbi-mock-justintanwk2001-6f2d.l.aivencloud.com:18828/defaultdb"
    );
    toast.success("Mock data URI successfully copied!");
  };

  return (
    <Dialog open={open} handler={onClose} className="max-w-sm mx-auto">
      <DialogHeader className="flex items-center gap-2">
        <Typography variant="h5" color="blue-gray">
          👋 Welcome to Eff BI
        </Typography>
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
          className="text-gray-500 hover:text-gray-700"
        >
          <CancelIcon/>
        </IconButton>
      </DialogHeader>
      <DialogBody divider className="grid place-items-center gap-4">
        <Typography
          color="blue"
          variant="h4"
          className="flex items-center gap-2"
        >
          <SettingsIcon className="text-blue-400" />
          Database Configuration Needed
        </Typography>
        <Typography className="text-center font-normal">
          Connect your database in the Data Page to get started with Eff BI.
          <Alert severity="info" className="text-left mt-4">
           If you don't currently have a database URI, you may use our mock database URI:{" "}
            <Button
              variant="text"
              color="blue"
              className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 px-1 py-1"
              onClick={handleCopyMockData}
            >
              <ContentCopyIcon fontSize="small" />
              Mock Data
            </Button>
          </Alert>

        </Typography>

        <Box className="w-full flex justify-center gap-4 mb-4 mt-4">
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
