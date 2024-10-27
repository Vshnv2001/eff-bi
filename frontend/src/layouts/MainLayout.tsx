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
    <div
      className={
        location.pathname === "/" ? "bg-[#f0f2fe] h-full" : "bg-gray-800 h-full"
      }
    >
      {shouldShowNavbar && <EffBINavbar />}
      <div className="relative top-[60px]">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
