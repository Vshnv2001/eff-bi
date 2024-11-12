import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import html2canvas from "html2canvas";

interface DownloadMenuProps {
  chartRef: React.RefObject<HTMLDivElement>;
}

export function DownloadMenu({ chartRef }: DownloadMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format: string) => {
    if (!chartRef.current) return;

    const element = chartRef.current;

    // Store the original overflow style
    const originalOverflow = element.style.overflow;

    // Remove overflow to allow full content capture
    element.style.overflow = "visible";

    // Force a reflow and wait for the next animation frame to apply the changes
    await new Promise((resolve) => requestAnimationFrame(resolve));

    try {
      if (["PNG", "JPEG", "JPG"].includes(format)) {
        const canvas = await html2canvas(element, {
          scrollY: 0, // Ensure it captures from the top
        });
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `chart.${format.toLowerCase()}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          },
          format === "JPEG" ? "image/jpeg" : undefined
        );
      }
    } finally {
      // Restore the original overflow style
      element.style.overflow = originalOverflow;
    }

    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleMenuClick} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 8, marginTop: 5 } }}
      >
        <MenuItem onClick={() => handleDownload("PNG")}>
          Download as PNG
        </MenuItem>
        <MenuItem onClick={() => handleDownload("JPG")}>
          Download as JPG
        </MenuItem>
        <MenuItem onClick={() => handleDownload("JPEG")}>
          Download as JPEG
        </MenuItem>
      </Menu>
    </>
  );
}
