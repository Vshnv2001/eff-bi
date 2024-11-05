import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  Typography,
  Dialog,
  Button,
  Spinner,
  Accordion,
  AccordionHeader,
  AccordionBody,
  IconButton,
  DialogHeader,
  DialogBody,
  Tooltip,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { componentMapping } from "../components/Dashboard/ComponentMapping";
import { TileProps } from "../components/Dashboard/TileProps";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NewTile from "../components/Dashboard/NewTile/NewTile";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  ClipboardIcon,
  CheckIcon,
  PencilIcon,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { DownloadMenu } from "../components/Dashboard/DownloadMenu";
import { toast } from "react-toastify";

type ComponentKeys = keyof typeof componentMapping;

export default function DashboardPage({ pathname }: { pathname: string }) {
  //const { dashboardId } = useParams();
  const dashboardId = parseInt(pathname.replace("/", ""), 10);
  const [tilesData, setTilesData] = useState<TileProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardName, setDashboardName] = useState<string>("");
  const [isNewTileDialogOpen, setIsNewTileDialogOpen] = useState(false);
  const [open, setOpen] = useState<number[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editingTileId, setEditingTileId] = useState<number | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedTile, setSelectedTile] = useState<TileProps | undefined>(
    undefined
  );

  const chartRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> }>(
    {}
  );

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    console.log("use effect");
    fetchTiles();
    fetchDashboardName();
  }, []);

  const fetchDashboardName = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-name/`,
        {
          params: { dash_id: dashboardId },
        }
      );
      setDashboardName(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard name:", error);
    }
  };

  const refreshTile = async (tileId: number) => {
    setLoading(true);

    try {
      // Refresh tile
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/refresh-dashboard-tile/`,
        {
          tile_id: tileId,
        }
      );
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tiles/${tileId}/`,
        {
          params: { dash_id: dashboardId },
        }
      );

      if (response.status === 200 && response.data && response.data.data) {
        setTilesData((prevTiles) =>
          prevTiles.map((tile) =>
            tile.id === tileId ? response.data.data : tile
          )
        );
        toast.success("Refreshed successfully!");
      }
    } catch (error) {
      console.error("Error refreshing tile:", error);
      // setError("Failed to refresh tile");
      toast.success("Unable to refreshed tile");
    } finally {
      setLoading(false);
    }
  };

  const fetchTiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-tiles/`,
        {
          params: { dash_id: dashboardId },
        }
      );

      if (response.status === 200 && response.data && response.data.data) {
        setTilesData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tiles:", error);
      setError("Failed to load dashboard tiles");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (value: number) => {
    setOpen((prevOpen) =>
      prevOpen.includes(value)
        ? prevOpen.filter((id) => id !== value)
        : [...prevOpen, value]
    );
  };

  const handleTileSaved = (message: string) => {
    // console.log("Toast Message:", message);
    toast.success(message);
  };

  const deleteTile = async (tileId: number | undefined) => {
    setLoading(true);
    // console.log("delete tile", tileId);
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/dashboard-tiles-delete/${tileId}/`
      );

      if (response.status === 200) {
        setTilesData((prevTiles) =>
          prevTiles.filter((tile) => tile.id !== tileId)
        );
      }
      toast.success("Tile deleted successfully!");
    } catch (error) {
      console.error("Error deleting tile:", error);
      toast.error("Unable to delete tile");
    } finally {
      setLoading(false);
      setIsDeleteConfirmationOpen(false);
      setSelectedTile(undefined);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-8 ${isNewTileDialogOpen ? "opacity-60" : ""}`}
    >
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner className="h-10 w-10" />
        </div>
      )}

      {/*
      <Breadcrumbs
        aria-label="breadcrumb"
        style={{ color: "white", fontSize: "16px" }}
      >
        <Link
          underline="hover"
          color="inherit"
          href="/"
          style={{ color: "#fff" }}
        >
          Home
        </Link>
        <Link
          underline="hover"
          href="/dashboards"
          color="inherit"
          style={{ color: "#fff" }}
        >
          Dashboards
        </Link>
        <Link
          underline="hover"
          color="text.primary"
          style={{ color: "#4995ec" }}
        >
          {dashboardName}
        </Link>
      </Breadcrumbs>
      */}

      <div className="flex items-center justify-between mb-8 relative mt-4">
        <div className="absolute inset-x-0 text-center">
          <Typography color="gray" className="text-3xl font-bold">
            {dashboardName}
          </Typography>
        </div>
        <div className="flex-1" />

        <Button
          variant="text"
          size="sm"
          color="white"
          className="flex items-center gap-2 justify-center font-bold bg-blue-500 hover:bg-blue-600 hover:text-white z-10"
          onClick={() => setIsNewTileDialogOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Create Tile
        </Button>
      </div>

      <div className="grid grid-cols-3 grid-rows-2 gap-6">
        {tilesData.map((tileData, index) => {
          if (!chartRefs.current[index]) {
            chartRefs.current[index] = React.createRef<HTMLDivElement>();
          }

          const Component =
            componentMapping[tileData.component as ComponentKeys] || null;

          let componentProps = tileData.tile_props;
          if (typeof tileData.tile_props === "string") {
            try {
              componentProps = JSON.parse(tileData.tile_props);
            } catch (error) {
              console.error("Error parsing tile props", error);
              return null;
            }
          }

          return (
            <div key={tileData.id} className="isolate">
              <Card className="bg-white shadow rounded-lg w-full overflow-auto">
                <CardBody className="flex flex-col">
                  <div className="flex justify-end gap-2 mb-4">
                    <Tooltip
                      content="Edit"
                      placement="top"
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                    >
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        className="rounded-full w-8 h-8"
                        onClick={() => {
                          setEditingTileId(tileData.id);
                          setIsNewTileDialogOpen(true);
                        }}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      content="Refresh a tile. This replaces the current tile's data."
                      placement="top"
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                    >
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        className="rounded-full w-8 h-8"
                        onClick={() => refreshTile(tileData.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      content="Delete"
                      placement="top"
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                    >
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        className="rounded-full w-8 h-8"
                        onClick={() => {
                          setIsDeleteConfirmationOpen(true);
                          setSelectedTile(tileData);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <DownloadMenu chartRef={chartRefs.current[index]} />
                  </div>

                  <div
                    ref={chartRefs.current[index]}
                    className="w-full overflow-auto"
                  >
                    {Component && (
                      <Component {...componentProps} title={tileData.title} />
                    )}
                  </div>

                  <Accordion
                    open={open.includes(index)}
                    icon={<Icon isOpen={open.includes(index)} />}
                  >
                    <AccordionHeader
                      className="text-sm"
                      onClick={() => handleOpen(index)}
                    >
                      User Query
                    </AccordionHeader>
                    <AccordionBody>
                      <Typography className="text-sm">{tileData.description}</Typography>
                    </AccordionBody>
                  </Accordion>

                  <Accordion
                    open={open.includes(index + tilesData.length)}
                    icon={
                      <Icon isOpen={open.includes(index + tilesData.length)} />
                    }
                  >
                    <AccordionHeader
                      onClick={() => handleOpen(index + tilesData.length)}
                      className="text-sm"
                    >
                      SQL Query
                    </AccordionHeader>
                    <AccordionBody>
                      <div className="relative">
                        {open.includes(index + tilesData.length) && (
                          <button
                            onClick={() =>
                              handleCopy(tileData.sql_query, index)
                            }
                            className="absolute top-2 right-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            title="Copy SQL"
                          >
                            {copiedIndex === index ? (
                              <CheckIcon className="h-4 w-4 text-green-500" />
                            ) : (
                              <ClipboardIcon className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        )}
                        <SyntaxHighlighter
                          language="sql"
                          className="w-full rounded-lg text-sm"
                        >
                          {tileData.sql_query}
                        </SyntaxHighlighter>
                      </div>
                    </AccordionBody>
                  </Accordion>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>

      <Dialog
        open={isNewTileDialogOpen}
        handler={() => {
          setIsNewTileDialogOpen(false);
          setEditingTileId(null);
        }}
        size="xl"
      >
        <NewTile
          onClose={() => {
            setIsNewTileDialogOpen(false);
            setEditingTileId(null);
            fetchTiles();
          }}
          tileId={editingTileId}
          onSaveSuccess={handleTileSaved}
        />
      </Dialog>

      {/* Delete tile confirmation dialog */}
      <Dialog
        open={isDeleteConfirmationOpen}
        handler={() => {
          setIsDeleteConfirmationOpen(false);
        }}
        size="md"
      >
        <DialogHeader>
          <Typography variant="h5" color="blue-gray">
            Are you sure you want to delete this tile?
          </Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <Typography
            variant="h6"
            className="text-center font-normal text-black"
          >
            {`You are deleting ${selectedTile?.title} tile.`}
          </Typography>
          <Typography className="text-black">
            This action is <span className="text-red-500">irreversible</span>.
            Please proceed with caution.
          </Typography>
          <div className="w-full flex justify-center gap-4 mb-4 mt-4">
            <Button
              type="submit"
              color="blue"
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setIsDeleteConfirmationOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="red"
              className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white"
              onClick={() => deleteTile(selectedTile?.id)}
            >
              Delete
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}

function Icon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={`${isOpen ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}
