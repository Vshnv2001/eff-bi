import React from "react";
import { Typography } from "@material-tailwind/react";
import { Box, Chip } from "@mui/material";

interface ChartPreferencesProps {
  componentNames: Record<string, string>;
  selectedTemplates: string[];
  setSelectedTemplates: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ChartPreferences: React.FC<ChartPreferencesProps> = ({
  componentNames,
  selectedTemplates,
  setSelectedTemplates,
}) => {
  const handleChipClick = (component: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(component)
        ? prev.filter((item) => item !== component)
        : [...prev, component]
    );
  };

  return (
    <div className="relative mb-4">
      <Typography variant="h6" color="blue-gray" className="mb-1">
        Chart Preferences (Optional)
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {Object.keys(componentNames).map((component) => (
          <Chip
            key={component}
            label={component}
            onClick={() => handleChipClick(component)}
            color={
              selectedTemplates.includes(component) ? "primary" : "default"
            }
          />
        ))}
      </Box>
    </div>
  );
};
