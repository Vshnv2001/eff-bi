import {
  Navbar,
  Button
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useState, useEffect } from "react";
import UserDropdown from "./UserDropdown";

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

  return (
    <Navbar
      className={`fixed top-0 z-50 max-w-full px-6 py-2.4 bg-white rounded-none transition-transform duration-200 ${
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
                color="blue-gray"
                className="flex items-center gap-2"
                onClick={() => navigate("/view-data")}
              >
                Data
              </Button>
              <Button
                variant="text"
                size="sm"
                color="blue-gray"
                className="flex items-center gap-2"
                onClick={() => navigate("/dashboards")}
              >
                Dashboards
              </Button>
              <Button
                variant="text"
                size="sm"
                color="blue-gray"
                className="flex items-center gap-2"
                onClick={() => navigate("/access-permissions")}
              >
                Permissions
              </Button>
              <Button
                variant="text"
                size="sm"
                color="blue-gray"
                className="flex items-center gap-2"
                onClick={() => navigate("/faq")}
              >
                Docs
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                variant="text"
                size="sm"
                color="blue-gray"
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
                color="blue-gray"
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
                color="blue-gray"
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
          {isUserLoggedIn ? (
            <UserDropdown />
          ) : (
            <Button
              variant="text"
              size="sm"
              color="blue-gray"
              className="flex items-center gap-2"
              onClick={() => navigate("/auth")}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </Navbar>
  );
}
