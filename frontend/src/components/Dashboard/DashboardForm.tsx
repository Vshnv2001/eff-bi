import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Input,
  Textarea,
} from "@material-tailwind/react";
import axios from "axios";

// Define the props type
interface DashboardFormProps {
  open: boolean;
  handleOpen: () => void;
  setOpen: (open: boolean) => void;
  dashboardName: string;
  setDashboardName: (name: string) => void;
  dashboardDescription: string;
  setDashboardDescription: (description: string) => void;
}

export default function DashboardForm({
  open,
  handleOpen,
  setOpen,
  dashboardName,
  setDashboardName,
  dashboardDescription,
  setDashboardDescription,
}: DashboardFormProps) {

  const handleCreate = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/`, {
        title: dashboardName,
        description: dashboardDescription,
      });
      console.log("Dashboard created successfully:", response.data);
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating dashboard:", error);
    }
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="md"
      className="bg-gray-300 border-4 border-black text-black flex flex-col items-center justify-between h-[50%]"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader className="text-black">Create Dashboard</DialogHeader>
      <DialogBody>
        <div className="mb-4">
          <Typography variant="small" color="blue-gray" className="font-normal mb-2 text-black">
            Dashboard Name
          </Typography>
          <Input
            type="text"
            placeholder="Enter dashboard name"
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            className="!border-gray-600 focus:!border-gray-500 bg-gray-700 text-black"
            labelProps={{
              className: "hidden",
            }}
            containerProps={{
              className: "min-w-[100px]",
            }}
            crossOrigin="anonymous"
          />
        </div>
        <div className="mb-4">
          <Typography variant="small" color="blue-gray" className="font-normal mb-2 text-black">
            Dashboard Description
          </Typography>
          <Textarea
            placeholder="Enter dashboard description"
            value={dashboardDescription}
            onChange={(e) => setDashboardDescription(e.target.value)}
            className="!border-gray-600 focus:!border-gray-500 bg-gray-700 text-black"
            labelProps={{
              className: "hidden",
            }}
            containerProps={{
              className: "min-w-[100px]",
            }}
          />
        </div>
      </DialogBody>
      <DialogFooter className="border-t border-gray-700">
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-2 text-red-500 hover:bg-red-500/10"
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={handleCreate}
          className="bg-green-500 hover:bg-green-600"
        >
          Create
        </Button>
      </DialogFooter>
    </Dialog>
  );
}