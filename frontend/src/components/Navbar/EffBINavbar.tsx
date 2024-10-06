import React from "react";
import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

export default function EffBINavbar() {
  const navigate = useNavigate();
  return (
    <Navbar className="mx-auto max-w-screen-xl px-6 py-3 mb-10 bg-gray-800">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 text-2xl font-bold text-white"
        >
          effBI
        </Typography>
        <div className="flex items-center gap-4">
          <Button variant="text" size="sm" color="white" className="flex items-center gap-2">
            View Data
          </Button>
          <Button variant="text" size="sm" color="white" className="flex items-center gap-2">
            Dashboards
          </Button>
          <Menu>
            <MenuHandler>
              <Button variant="text" size="sm" color="white" className="flex items-center gap-2">
                Settings
              </Button>
            </MenuHandler>
            <MenuList className="bg-gray-800">
              <MenuItem
                variant="text"
                size="sm"
                color="white"
                className="flex items-center text-white gap-2 p-3 bg-gray-800 border-none"
                onClick={() => navigate("/settings/database")}
              >
                Database Settings
              </MenuItem>
              <MenuItem
                variant="text"
                size="sm"
                color="white"
                className="flex items-center text-white gap-2 p-3 bg-gray-800 border-none"
                onClick={() => navigate("/settings/organization")}
              >
                Organization Management
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}