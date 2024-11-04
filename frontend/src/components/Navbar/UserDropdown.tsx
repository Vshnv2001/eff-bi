import {
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react"
import { UserCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";

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
          <Avatar
            src="https://docs.material-tailwind.com/img/face-2.jpg"
            alt="User Avatar"
            size="sm"
            className="cursor-pointer"
          />
        </Button>
      </MenuHandler>
      <MenuList>
        <MenuItem className="flex items-center gap-2" onClick={handleProfile}>
          <UserCircleIcon className="h-4 w-4" />
          <span>User Profile</span>
        </MenuItem>
        <hr className="my-2 border-blue-gray-50" />
        <MenuItem className="flex items-center gap-2 text-red-500" onClick={handleLogout}>
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          <span>Logout</span>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}