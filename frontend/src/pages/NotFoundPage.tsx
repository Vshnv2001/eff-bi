import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-center items-center bg-gradient-to-r from-red-100 to-blue-400 text-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-6">
          The page you are looking for does not exist.
        </p>
        <div className="flex justify-center space-x-4 mt-6">
          <Button
            className="flex items-center bg-white bg-opacity-80 text-black"
            onClick={() => goBack()}
          >
            Go Back
          </Button>
          <Button
            className="flex items-center bg-white bg-opacity-80 text-black"
            onClick={() => goHome()}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
