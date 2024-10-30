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
          specific conditions,{" "}
          <span className="text-red-500 font-bold">
            always use precise values in conditions
          </span>
          . For example, if the condition is "injury," do not substitute with
          synonyms or related terms like "injured" or "torn hamstring."
          <br />
          <br />
          Ensure that the conditions match exactly what is recorded in the
          dataset to avoid discrepancies in the analysis. It is also important
          to clarify the metrics used to define vague terms. For instance, an
          ideal specification could highlight the top players based on the
          number of gold medals they have won.
        </Typography>
        <Button variant="filled" onClick={handler} className="mt-4">
          Close
        </Button>
      </div>
    </Dialog>
  );
};

export default InfoTooltip;
