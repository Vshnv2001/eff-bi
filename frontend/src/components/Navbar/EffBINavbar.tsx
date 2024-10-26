import {
  Navbar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { Link } from "react-router-dom";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useState, useEffect } from "react";

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const threshold = 100;
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      // At the very top of the page, always show the navbar
      if (scrollY < threshold) {
        setVisible(true);
        setScrollDirection("up");
      } else {
        setVisible(scrollY < lastScrollY);
        setScrollDirection(scrollY > lastScrollY ? "down" : "up");
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDirection]);

  return visible;
};

export default function EffBINavbar() {
  const navigate = useNavigate();
  const sessionContext = useSessionContext();
  const isVisible = useScrollDirection();

  const isUserLoggedIn =
    sessionContext.loading || sessionContext.doesSessionExist;

  async function logoutClicked() {
    await signOut();
    navigate("/auth");
  }

  return (
    <Navbar
      className={`fixed top-0 z-50 max-w-full px-6 py-3 bg-gray-800 rounded-none transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between text-blue-gray-900 w-full">
        <div className="flex items-center gap-4">
          <Link to="/">
            <img
              src="/assets/logo-nobg.png"
              alt="EFF BI Logo"
              className="w-15 h-10 block my-0"
            />
          </Link>
          {isUserLoggedIn ? (
            <div className="flex items-center gap-4">
              <Button
                variant="text"
                size="sm"
                color="white"
                className="flex items-center gap-2"
                onClick={() => navigate("/view-data")}
              >
                View Data
              </Button>
              <Button
                variant="text"
                size="sm"
                color="white"
                className="flex items-center gap-2"
                onClick={() => navigate("/dashboards")}
              >
                Dashboards
              </Button>
              <Menu>
                <MenuHandler>
                  <Button
                    variant="text"
                    size="sm"
                    color="white"
                    className="flex items-center gap-2"
                  >
                    Settings
                  </Button>
                </MenuHandler>
                <MenuList className="bg-gray-800">
                  <MenuItem
                    className="flex items-center text-white gap-2 p-3 bg-gray-800 border-none"
                    onClick={() => navigate("/settings/database")}
                  >
                    Database Settings
                  </MenuItem>
                  <MenuItem
                    className="flex items-center text-white gap-2 p-3 bg-gray-800 border-none"
                    onClick={() => navigate("/settings/access-permissions")}
                  >
                    Table Permissions
                  </MenuItem>
                  <MenuItem
                    className="flex items-center text-white gap-2 p-3 bg-gray-800 border-none"
                    onClick={() => navigate("/profile")}
                  >
                    User Profile
                  </MenuItem>
                </MenuList>
              </Menu>
              <Button
                variant="text"
                size="sm"
                color="white"
                className="flex items-center gap-2"
                onClick={() => navigate("/faq")}
              >
                FAQ
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                variant="text"
                size="sm"
                color="white"
                className="flex items-center gap-2"
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Features
              </Button>
              <Button
                variant="text"
                size="sm"
                color="white"
                className="flex items-center gap-2"
                onClick={() => {
                  const featuresSection = document.getElementById("reviews");
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Reviews
              </Button>
              <Button
                variant="text"
                size="sm"
                color="white"
                className="flex items-center gap-2"
                onClick={() => {
                  const featuresSection = document.getElementById("contact");
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Contact
              </Button>
            </div>
          )}
        </div>
        <div>
          <Button
            variant="text"
            size="sm"
            color="white"
            className="flex items-center gap-2"
            onClick={logoutClicked}
          >
            {isUserLoggedIn ? "Logout" : "Login"}
          </Button>
        </div>
      </div>
    </Navbar>
  );
}
