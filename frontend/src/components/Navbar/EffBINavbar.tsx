import React from "react";
import {
  Navbar,
  Typography,
  Button,
} from "@material-tailwind/react";

export default function EffBINavbar() {
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
          <Button variant="text" size="sm" color="white" className="flex items-center gap-2">
            Settings
          </Button>
        </div>
      </div>
    </Navbar>
  );
}