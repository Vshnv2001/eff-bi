import React from "react";
import { Card } from "@mui/material";

interface ImageComponentProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  alt,
  className,
}) => (
  <Card
    sx={{
      borderRadius: 4,
      boxShadow: 3,
      overflow: "hidden",
    }}
    className={className}
  >
    <div className="flex overflow-hidden relative flex-col aspect-[0.725]">
      <img
        loading="lazy"
        src={src}
        alt={alt}
        className="object-fit w-full h-full"
      />
    </div>
  </Card>
);

export default ImageComponent;