import React from "react";
import { Dialog, Button, Typography } from "@material-tailwind/react";

interface InfoDialogProps {
  open: boolean;
  handler: () => void;
}

const InfoTooltip: React.FC<InfoDialogProps> = ({ open, handler }) => {
  return (
    <Dialog open={open} handler={handler} size="md">
      <div className="p-4">
        <Typography variant="h6" color="blue-gray" className="mb-3">
          Visualization Details
        </Typography>
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
        <Button variant="filled" color={"red"} onClick={handler} className="mt-4">
          Close
        </Button>
      </div>
    </Dialog>
  );
};

export default InfoTooltip;
