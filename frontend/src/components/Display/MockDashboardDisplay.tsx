import React from "react";
import { Button } from "@material-tailwind/react";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import FadeIn from "../Animations/FadeIn";

const MockDashboardDisplay: React.FC = () => {
  return (
    <FadeIn>
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full p-8 pt-32 pb-36 space-y-6 md:space-y-0 md:space-x-10">
        <div className="md:w-2/3">
          <img
            src="/assets/final_dashboard.png"
            alt="Mock Dashboard"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col items-start md:w-1/3">
          <Typography
            variant="h4"
            gutterBottom
            className="font-bold text-black"
          >
            Dashboards
          </Typography>

          <Typography variant="body1" className="text-black">
            Add a collection of charts to your dashboard. They will be saved
            permanently, and you can easily edit, delete, or refresh your
            dashboards to always have the latest data.
          </Typography>
          <div className="flex space-x-4 mt-6">
            <Button className="flex items-center bg-red-400 bg-opacity-60 text-black">
              Read the docs
              <ArticleIcon className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default MockDashboardDisplay;
