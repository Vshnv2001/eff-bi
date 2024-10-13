import { Outlet, useLocation } from "react-router-dom";
import EffBINavbar from "../components/Navbar/EffBINavbar";

const MainLayout = () => {
  const location = useLocation();

  const pathsWithoutNavbar = [
    "/auth",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/save",
    "/auth/fetch",
  ];

  // Check if the current path starts with "/auth" or is one of the specified paths
  const shouldShowNavbar = !(
    pathsWithoutNavbar.includes(location.pathname) || 
    location.pathname.startsWith('/auth/')
  );

  return (
    <div className="bg-gray-custom">
      {shouldShowNavbar && <EffBINavbar />}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;