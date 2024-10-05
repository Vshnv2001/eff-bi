import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
