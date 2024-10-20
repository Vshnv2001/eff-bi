import React, { useEffect, useState } from "react";
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
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import { useAuth } from "./AuthenticationContext";
import { useNavigate } from "react-router-dom";
import { BACKEND_API_URL } from "../../config";

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
    orgId: "",
    name: "",
    databaseUri: "",
    dbType: "",
  });
  const [showTransition, setShowTransition] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const { setOrganizationId } = useAuth();
  const navigate = useNavigate();

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelection(event.target.value as "create" | "join");
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleNext = () => {
    setShowTransition(false);
    setTimeout(() => {
      if (selection === "create") {
        setStep("create");
      } else if (selection === "join") {
        setStep("join");
      }
      setShowTransition(true);
    }, 300);
  };

  const handleBack = () => {
    setShowTransition(false);
    setErrorMessage("");
    setTimeout(() => {
      setStep("select");
      setShowTransition(true);
    }, 300);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setOrgData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "databaseUri" ? { dbType: "" } : {}),
    }));
  };

  const handleDbTypeChange = (event: SelectChangeEvent<string>) => {
    setOrgData((prevData) => ({
      ...prevData,
      dbType: event.target.value as string,
    }));
  };

  const handleSubmit = async () => {
    if (step === "create") {
      if (orgData.databaseUri) {
        const connectionResponse = await fetch(`${BACKEND_API_URL}/api/connection/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uri: orgData.databaseUri,
            db_type: orgData.dbType,
          }),
        });

        if (!connectionResponse.ok) {
          const errorData = await connectionResponse.json();
          setErrorMessage(errorData.message || "Error connecting to database");
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 1000);
          return;
        }
      }

      const response = await fetch(`${BACKEND_API_URL}/api/organizations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: orgData.name,
          database_uri: orgData.databaseUri,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("json response", data);

        setOrganizationId(data.organization.id);
        onSubmit({ ...orgData, id: data.organization.id, action: step });
        navigate("/auth/save", { state: { isSuperAdmin: true } });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error creating organization");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 1000);
        console.error("Error creating organization");
      }
    } else if (step === "join") {
      // Get organization data
      const response = await fetch(
        `${BACKEND_API_URL}/api/organizations/${orgData.orgId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrganizationId(data.organization.id);
        onSubmit({ ...orgData, action: step });
        navigate("/auth/save", { state: { isSuperAdmin: false } });
      } else {
        setErrorMessage("Organization not found");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 1000);
        console.error("Organization not found");
      }
    }
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
      <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
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
                  sx={{ alignItems: "flex-start" }}
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
                name="name"
                label="Organization Name"
                type="text"
                value={orgData.name}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                fullWidth
                name="databaseUri"
                label="Database URI (Optional)"
                type="text"
                value={orgData.databaseUri}
                onChange={handleInputChange}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Select
                  value={orgData.dbType}
                  onChange={handleDbTypeChange} // This is now correctly typed
                  displayEmpty
                  inputProps={{ 'aria-label': 'Database Type' }}
                  disabled={!orgData.databaseUri} // Disable if databaseUri is empty
                >
                  <MenuItem value="" disabled>
                    Select Database Type
                  </MenuItem>
                  <MenuItem value="postgres">Postgres</MenuItem>
                  <MenuItem value="mysql">MySQL</MenuItem>
                  <MenuItem value="oracle">Oracle</MenuItem>
                  <MenuItem value="sqlite">SQLite</MenuItem>
                </Select>
                <FormHelperText>Select the database type</FormHelperText>
              </FormControl>
            </>
          )}

          {step === "join" && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="orgId"
              label="Organization ID"
              type="number"
              value={orgData.orgId}
              onChange={handleInputChange}
              className={`transition duration-300 ${
                isShaking ? "border-red-500 animate-shake" : "border-gray-300"
              }`}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "inherit",
                  },
                },
              }}
            />
          )}
          {errorMessage && (
            <p className="mt-1 text-red-500 text-sm">{errorMessage}</p>
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
        <Button onClick={step === "select" ? handleNext : handleSubmit} variant="contained">
          {step === "select" ? "Next" : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default OrganizationSelection;