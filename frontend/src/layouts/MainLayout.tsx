import { Outlet, useLocation } from "react-router-dom";
import EffBINavbar from "../components/Navbar/EffBINavbar";

const MainLayout = () => {
  return (
    <div className="bg-gray-900 text-gray-100 p-8">
      <EffBINavbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;