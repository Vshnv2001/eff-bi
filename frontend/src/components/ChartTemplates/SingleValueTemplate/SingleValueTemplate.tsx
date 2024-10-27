import { Typography } from "@material-tailwind/react";
import React from "react";

interface SingleValueTemplateProps {
  value: number;
  title: string;
}

const SingleValueTemplate: React.FC<SingleValueTemplateProps> = ({
  title,
  value,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </div>
  );
};

export default SingleValueTemplate;
