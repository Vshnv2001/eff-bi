import { Outlet } from "react-router-dom";
import EffBINavbar from "../components/Navbar/EffBINavbar";

const MainLayout = () => {
  return (
    <div className="bg-gray-custom">
      <EffBINavbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;