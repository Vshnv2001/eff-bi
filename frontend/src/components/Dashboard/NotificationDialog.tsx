import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
} from "@material-tailwind/react";
import { Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";

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
        <InfoIcon className="text-blue-500" />
        <Typography variant="h5" color="blue-gray">
          Welcome to Eff BI 👋
        </Typography>
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
          Head over to the Data Page to connect your database. If you don't have
          a database URI currently, try out our mock data by clicking:{" "}
          <Button
            variant="text"
            color="blue"
            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 px-1 py-0"
            onClick={handleCopyMockData}
          >
            <ContentCopyIcon fontSize="small" />
            Mock Data
          </Button>
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
