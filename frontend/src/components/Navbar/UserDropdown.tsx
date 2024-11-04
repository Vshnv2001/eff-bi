import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react"
import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { User, UserCircleIcon, ArrowRightCircleIcon } from "lucide-react";

export default function UserDropdown() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  }

  const handleProfile = () => {
    navigate("/profile");
  }

  return (
    <Menu>
      <MenuHandler>
        <Button variant="text" color="blue-gray" className="p-0">
          <UserCircleIcon
            size="sm"
            className="cursor-pointer h-8 w-8"
          />
        </Button>
      </MenuHandler>
      <MenuList>
        <MenuItem className="flex items-center gap-2" onClick={handleProfile}>
          <User className="h-4 w-4" />
          <span>User Profile</span>
        </MenuItem>
        <hr className="my-2 border-blue-gray-50" />
        <MenuItem className="flex items-center gap-2 text-red-500" onClick={handleLogout}>
          <ArrowRightCircleIcon className="h-4 w-4" />
          <span>Logout</span>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}