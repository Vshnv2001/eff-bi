import React, { useState } from "react";
import html2canvas from "html2canvas";
import { Card, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Spinner } from "@material-tailwind/react";
import axios from "axios";
import { BACKEND_API_URL } from "../../../config";

interface SingleValueTemplateProps {
  value: number;
  title: string;
  id: number;
}

const SingleValueTemplate: React.FC<SingleValueTemplateProps> = ({
  title,
  value,
  id,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tileData, setTileData] = useState(value);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = (format: string) => {
    html2canvas(document.querySelector("#single-value-template")!).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${title}.${format}`;
      link.href = canvas.toDataURL(`image/${format}`);
      link.click();
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  async function handleRefresh(): Promise<void> {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_API_URL}/api/refresh-dashboard-tile/`, {
        tile_id: id,
      });
      setTileData(response.data.data.tile_props.value);  
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative mt-30">
      <Typography variant="h6" className="text-center text-black mb-10">
        {title}
      </Typography>
      
      <Card className="py-5 rounded-lg" style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", padding: 20 }}>
        
        <div className="flex justify-end">
        <IconButton size="small">
            <RefreshIcon onClick={handleRefresh} />
          </IconButton>
          <IconButton onClick={handleMenuClick} size="small">
            <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              borderRadius: 8,
              marginTop: 5,
            },
          }}
        >
          <MenuItem
            onClick={() => handleDownload("SVG")}
            sx={{
              typography: "body2",
              color: "text.primary",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
            }}
          >
            Download as SVG
          </MenuItem>
          <MenuItem
            onClick={() => handleDownload("PNG")}
            sx={{
              typography: "body2",
              color: "text.primary",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
            }}
          >
            Download as PNG
          </MenuItem>
          </Menu>
        </div>
        <Typography variant="h1" className="text-center mt-4">
          {tileData}
        </Typography>
      </Card>
    </div>
  );
};

export default SingleValueTemplate;
