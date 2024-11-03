import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type ParsedData = Record<string, any>;

declare global {
  interface Window {
    worker?: Worker;
  }
}

const FileUpload: React.FC = () => {
  const [data, setData] = useState<ParsedData[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [rowsToShow, setRowsToShow] = useState<number>(100);
  const [showAlert, setShowAlert] = useState<boolean>(false);


  useEffect(() => {
    return () => {
      if (window.worker) {
        window.worker.terminate();
      }
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileType = file.type;
    const reader = new FileReader();
    setLoading(true);
    setData([]);

    reader.onload = (e) => {
      const fileData = e.target?.result;

      if (!fileData) {
        setError("Unable to read file.");
        setLoading(false);
        return;
      }

      if (fileType.includes("csv")) {
        Papa.parse(fileData as string, {
          header: true,
          chunkSize: 1024,
          chunk: (results: any) => {
            setData((prevData) => [...prevData, ...results.data]);
          },
          complete: () => {
            setLoading(false);
            if (data.length > 100) setShowAlert(true);
            // console.log(showAlert);
          },
          error: () => {
            setError("Error parsing CSV file.");
            setLoading(false);
          },
        });
      } else {
        setError("Unsupported file format.");
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleUploadToDatabase = async () => {
    try {
      setUploading(true);
      const response = await axios.post("/api/upload", { data });
      // console.log("Data successfully uploaded:", response.data);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading data:", error);
      setUploading(false);
    }
  };

  return (
    <Container className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <Typography variant="h4" component="h1" gutterBottom>
        Upload a File
      </Typography>

      <Box className="border-2 border-dotted border-gray-300 rounded-lg p-8 text-center mt-4">
        <CloudUploadIcon className="text-gray-500 text-6xl" />
        <Typography className="mt-4 mb-4">
          Drag & drop your file here or click to upload
        </Typography>
        <TextField
          type="file"
          onChange={handleFileChange}
          fullWidth
          margin="normal"
          variant="outlined"
          inputProps={{ accept: ".csv", style: { display: 'none' } }} // Hide the default file input
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
          className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
        >
          Upload File
        </Button>
      </Box>

      {error && <Alert severity="error" className="mt-2">{error}</Alert>}
      {loading && <CircularProgress className="mt-2" />}

      {data.length > 0 && (
        <>
          <Box
            className="max-h-96 overflow-y-auto mt-2 w-full"
          >
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {Object.keys(data[0]).map((key) => (
                      <TableCell key={key} align="left">
                        {key}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, rowsToShow).map((row, index) => (
                    <TableRow key={index}>
                      {Object.keys(row).map((key) => (
                        <TableCell key={key} align="left">
                          {row[key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {data.length > rowsToShow && (
            <Box className="flex justify-center mt-4">
              <Button
                onClick={() => setRowsToShow(rowsToShow + 100)}
                variant="contained"
                color="primary"
                className="mx-2 px-4 py-2 text-white rounded shadow-md hover:bg-blue-700"
              >
                Load More
              </Button>
            </Box>
          )}

          <Box className="flex justify-center mt-4">
            <Button
              onClick={handleUploadToDatabase}
              disabled={uploading}
              variant="contained"
              color="primary"
              className="mx-2 px-4 py-2 text-white rounded shadow-md hover:bg-blue-700"
            >
              {uploading ? <CircularProgress size={24} /> : "Upload to Database"}
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default FileUpload;