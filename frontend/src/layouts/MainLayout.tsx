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

  const shouldShowNavbar = !(
    pathsWithoutNavbar.includes(location.pathname) ||
    location.pathname.startsWith("/auth/")
  );

  return (
    <div className="bg-gray-custom">
      {shouldShowNavbar && <EffBINavbar />}
      <div className="pt-[60px]">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
