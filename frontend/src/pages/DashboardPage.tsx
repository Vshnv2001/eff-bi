import { useEffect, useState } from "react";
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
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { componentMapping } from "../components/Dashboard/ComponentMapping";
import { TileProps } from "../components/Dashboard/TileProps";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NewTile from "../components/Dashboard/NewTile";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ClipboardIcon, CheckIcon } from "lucide-react";

type ComponentKeys = keyof typeof componentMapping;

export default function DashboardPage() {
  const { dashboardId } = useParams();

  const [tilesData, setTilesData] = useState<TileProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardName, setDashboardName] = useState<string>("");
  const [isNewTileDialogOpen, setIsNewTileDialogOpen] = useState(false);
  const [open, setOpen] = useState(-1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
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

  const handleOpen = (value: number) => setOpen(open === value ? -1 : value);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner className="h-10 w-10" />
        </div>
      )}

      <Breadcrumbs aria-label="breadcrumb" className="text-gray-700 mb-4">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/dashboards">
          Dashboards
        </Link>
        <Link underline="hover" color="text.primary" className="text-blue-500">
          {dashboardName}
        </Link>
      </Breadcrumbs>

      <div className="flex items-center justify-between mb-8">
        <Typography className="text-3xl font-semibold">
          {dashboardName}
        </Typography>
        <Button
          variant="text"
          size="sm"
          color="white"
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => setIsNewTileDialogOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {tilesData.map((tileData, index) => {
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
              <Card className="bg-white shadow rounded-lg">
                <CardBody className="flex flex-col">
                  <div className="w-full">
                    {Component && (
                      <Component {...componentProps} title={tileData.title} />
                    )}
                  </div>

                  <Accordion
                    open={open === index}
                    icon={<Icon id={index} open={open} />}
                  >
                    <AccordionHeader onClick={() => handleOpen(index)}>
                      User Query
                    </AccordionHeader>
                    <AccordionBody>
                      <Typography>{tileData.description}</Typography>
                    </AccordionBody>
                  </Accordion>

                  <Accordion
                    open={open === index + tilesData.length}
                    icon={<Icon id={index + tilesData.length} open={open} />}
                  >
                    <AccordionHeader
                      onClick={() => handleOpen(index + tilesData.length)}
                    >
                      SQL Query
                    </AccordionHeader>
                    <AccordionBody>
                      <div className="relative">
                        {open === index + tilesData.length && (
                          <button
                            onClick={() => handleCopy(tileData.sql_query, index)}
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
                          className="w-full rounded-lg"
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
        handler={() => setIsNewTileDialogOpen(false)}
        size="md"
      >
        <NewTile
          onClose={() => {
            setIsNewTileDialogOpen(false);
            fetchTiles();
          }}
        />
      </Dialog>
    </div>
  );
}

function Icon({ id, open }: { id: number; open: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}