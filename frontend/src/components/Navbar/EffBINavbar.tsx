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

export default function EffBINavbar() {
  const navigate = useNavigate();
  const sessionContext = useSessionContext();

  async function logoutClicked() {
    await signOut();
    navigate("/auth");
  }

  return (
    <Navbar className="max-w-full px-6 py-3 bg-gray-800 rounded-none">
      <div className="flex items-center justify-between text-blue-gray-900 w-full">
        <div className="flex items-center gap-4">
          <Link to="/">
            <img
              src="/assets/logo-nobg.png"
              alt="EFF BI Logo"
              className="w-15 h-10 block my-0"
            />
          </Link>
          <Button
            variant="text"
            size="sm"
            color="white"
            className="flex items-center gap-2"
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

          {/* <Button
            variant="text"
            size="sm"
            color="white"
            className="flex items-center gap-2"
            onClick={() => navigate("/chatbot")}
          >
            Chatbot
          </Button> */}

          {/* <Button
            variant="text"
            size="sm"
            color="white"
            className="flex items-center gap-2"
            onClick={() => navigate("/file/upload")}
          >
            Upload
          </Button> */}
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
                Access Permissions
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div>
          <Button
            variant="text"
            size="sm"
            color="white"
            className="flex items-center gap-2"
            onClick={logoutClicked}
          >
            {sessionContext.loading || !sessionContext.doesSessionExist
              ? "Login"
              : "Logout"}
          </Button>
        </div>
      </div>
    </Navbar>
  );
}
