import React, { useState } from "react";
import { mockHistory } from "./MockHistory";
import ChatHistory from "./ChatHistory";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState(mockHistory);
  const [filteredHistory, setFilteredHistory] = useState(mockHistory);
  const [sqlType, setSqlType] = useState("MySQL");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: history.length + 1,
        type: sqlType,
        question: message,
        answer: "This is a placeholder answer for: " + message,
      };
      setHistory((prev) => [...prev, newMessage]);
      setFilteredHistory((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setFilteredHistory(
      history.filter(
        (msg) =>
          msg.question.toLowerCase().includes(query) ||
          msg.answer.toLowerCase().includes(query)
      )
    );
  };

  return (
    <Grid container style={{ height: `calc(100vh - 80px)` }}>
      <Grid item xs={3} component={Paper} elevation={3} square>
        <Box p={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search history..."
            onChange={handleFilterChange}
            margin="normal"
          />
          <Typography variant="h6" gutterBottom>
            History
          </Typography>
          <Box
            style={{ height: `calc(100vh - 200px)`, overflowY: "auto" }}
          >
            <ChatHistory history={filteredHistory} />
          </Box>
        </Box>
      </Grid>

      <Grid item xs={9} container direction="column" spacing={2}>
        <Grid item>
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel>SQL Type</InputLabel>
            <Select
              value={sqlType}
              onChange={(e) => setSqlType(e.target.value)}
              label="SQL Type"
            >
              <MenuItem value="MySQL">MySQL</MenuItem>
              <MenuItem value="PostgreSQL">PostgreSQL</MenuItem>
              <MenuItem value="SQLite">SQLite</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Typography variant="h6">SQL Type: {sqlType}</Typography>
        </Grid>
        <Grid item xs className="flex-grow overflow-y-auto">
          <Box
            style={{
              height: `calc(100vh - 350px)`, // Adjust this height to ensure the typing area fits nicely
              overflowY: "auto",
              padding: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {history.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent: msg.type === sqlType ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "70%",
                    padding: 1,
                    borderRadius: "20px",
                    backgroundColor: msg.type === sqlType ? "#d1e7dd" : "#f8d7da",
                    color: msg.type === sqlType ? "#0f5132" : "#721c24",
                  }}
                >
                  <Typography variant="body2">
                    {msg.type === sqlType ? msg.question : msg.answer}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item>
          <form onSubmit={handleSendMessage}>
            <Grid container spacing={2}>
              <Grid item xs>
                <TextField
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  variant="outlined"
                  required
                  size="small" // Adjusted height for smaller text field
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Chatbot;