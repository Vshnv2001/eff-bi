import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Slide,
} from "@mui/material";

interface OrganizationSelectionProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const OrganizationSelection: React.FC<OrganizationSelectionProps> = ({
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState<"select" | "create" | "join">("select");
  const [selection, setSelection] = useState<"create" | "join" | "">("");
  const [orgData, setOrgData] = useState({
    id: "",
    name: "",
    databaseUri: "",
  });
  const [showTransition, setShowTransition] = useState(true); // For handling slide transitions

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelection(event.target.value as "create" | "join");
  };

  const handleNext = () => {
    setShowTransition(false); // Hide current step with slide out

    setTimeout(() => {
      if (selection === "create") {
        setStep("create");
      } else if (selection === "join") {
        setStep("join");
      }
      setShowTransition(true); // Slide in the next step
    }, 300); // Timing to match the slide transition
  };

  const handleBack = () => {
    setShowTransition(false); // Hide current step with slide out

    setTimeout(() => {
      setStep("select");
      setShowTransition(true); // Slide in the previous step
    }, 300);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setOrgData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit({ ...orgData, action: step });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        p: 4,
      }}
    >
      <Typography
        component="h1"
        variant="h5"
        sx={{textAlign: "center" }}
      >
        {step === "select"
          ? "Organization Selection"
          : step === "create"
          ? "Create Organization"
          : "Join Organization"}
      </Typography>

      {/* Slide component for transitions */}
      <Slide
        in={showTransition}
        direction={step === "select" ? "right" : "left"}
      >
        <Box>
          {step === "select" && (
            <Box sx={{ textAlign: "center" }}>
              <FormControl component="fieldset" sx={{ mt: 2, width: "100%" }}>
                <RadioGroup
                  aria-label="organization-selection"
                  name="organization-selection"
                  value={selection}
                  onChange={handleSelectionChange}
                  sx={{ alignItems: "flex-start" }} // Align items to the left
                >
                  <FormControlLabel
                    value="create"
                    control={<Radio />}
                    label="Create a new organization"
                  />
                  <FormControlLabel
                    value="join"
                    control={<Radio />}
                    label="Join an existing organization"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          )}

          {step === "create" && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                name="id"
                label="Organization ID"
                type="number"
                value={orgData.id}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="name"
                label="Organization Name"
                type="text"
                value={orgData.name}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="databaseUri"
                label="Database URI"
                type="text"
                value={orgData.databaseUri}
                onChange={handleInputChange}
              />
            </>
          )}

          {step === "join" && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="id"
              label="Organization ID"
              type="number"
              value={orgData.id}
              onChange={handleInputChange}
            />
          )}
        </Box>
      </Slide>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          onClick={step === "select" ? onClose : handleBack}
          variant="outlined"
        >
          {step === "select" ? "Back" : "Previous"}
        </Button>
        {step === "select" ? (
          <Button
            onClick={handleNext}
            disabled={!selection}
            variant="contained"
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default OrganizationSelection;
