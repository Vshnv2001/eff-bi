import React from "react";
import { Button } from "@material-tailwind/react";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const Flyer: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full p-8 space-y-6 md:space-y-0 md:space-x-10">
      {/* Left Section with Text */}
      <div className="flex flex-col items-start md:w-1/3">
        <Typography variant="h3" gutterBottom className="font-bold text-2xl">
          User Permissions
        </Typography>
        <Typography variant="body1" className="text-black">
          Manage user roles and permissions within your organization with ease,
          ensuring data security and integrity.
        </Typography>
        <div className="flex space-x-4 mt-6">
          <Button
            className="flex items-center bg-white bg-opacity-80 text-black"
            onClick={() =>
              window.open(
                import.meta.env.VITE_DOCS_URL +
                  "/docs/user/getting-started/table-permissions",
                "_blank"
              )
            }
          >
            Read the docs
            <ArticleIcon className="ml-2" />
          </Button>
          <Button
            className="flex items-center bg-white bg-opacity-80 text-black"
            onClick={() => navigate("/access-permissions")}
          >
            Get Started
            <PlayArrowIcon className="ml-2" />
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
