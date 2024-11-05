import React from "react";
import { Button } from "@material-tailwind/react";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";

const Flyer: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full p-8 space-y-6 md:space-y-0 md:space-x-10">
      {/* Left Section with Text */}
      <div className="flex flex-col items-start md:w-1/3">
        <Typography variant="h4" gutterBottom className="font-bold text-2xl">
          Customise user roles
        </Typography>
        <Typography variant="body1" className="text-black">
          Add users to your organization and assign them roles with ease.
          Customize each user's role, and grant admin privileges to manage
          higher-level tasks when necessary.
        </Typography>
        <div className="flex space-x-4 mt-6">
          <Button color="blue" className="flex items-center bg-opacity-80">
            Read the docs
            <ArticleIcon className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Right Section with Image */}
      <div className="md:w-2/3">
        <img
          src="/assets/permission.png"
          alt="Flyer"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default Flyer;
