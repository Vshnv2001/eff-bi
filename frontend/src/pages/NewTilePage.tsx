"use client"

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button,
} from "@material-tailwind/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";

export default function NewTile() {
  const [tileName, setTileName] = useState("");
  const [tileDescription, setTileDescription] = useState("");
  const { dashboardId } = useParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.info('Generating KPI...', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Reset form fields
    setTileName("");
    setTileDescription("");
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <Typography variant="h2" color="blue-gray" className="mb-8 text-4xl font-bold">
        Create New Tile
      </Typography>
      
      <Card className="w-full max-w-[40rem] mx-auto">
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Tile Name
              </Typography>
              <Input
                size="lg"
                placeholder="Enter tile name"
                value={tileName}
                onChange={(e) => setTileName(e.target.value)}
              />
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Tile Description
              </Typography>
              <Textarea
                size="lg"
                placeholder="Enter tile description"
                value={tileDescription}
                onChange={(e) => setTileDescription(e.target.value)}
                rows={4}
                className="required-border"
              />
            </div>

            <Button type="submit" size="lg" color="blue" className="mt-6">
              Generate
            </Button>
          </form>
        </CardBody>
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}