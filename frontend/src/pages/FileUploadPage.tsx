import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";

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

  useEffect(() => {
    return () => {
      // Cleanup web worker
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
        // Handle CSV parsing in the main thread
        Papa.parse(fileData as string, {
          header: true,
          chunkSize: 1024,
          chunk: (results: any) => {
            setData((prevData) => [...prevData, ...results.data]);
          },
          complete: () => {
            setLoading(false);
          },
          error: () => {
            setError("Error parsing CSV file.");
            setLoading(false);
          },
        });
      } else if (fileType.includes("sheet") || fileType.includes("excel")) {
        // Handle Excel in the Web Worker
        if (window.Worker) {
          const worker = new Worker(new URL("./fileParserWorker.ts", import.meta.url));
          window.worker = worker;

          // Pass XLSX library to worker
          (worker as any).XLSX = XLSX;

          worker.postMessage({ fileData, fileType });

          worker.onmessage = (message) => {
            const { type, data, message: errorMsg } = message.data;
            if (type === "complete") {
              setData(data);
              setLoading(false);
            } else if (type === "error") {
              setError(errorMsg);
              setLoading(false);
            }
          };

          worker.onerror = () => {
            setError("An error occurred during file processing.");
            setLoading(false);
          };
        }
      } else {
        setError("Unsupported file format.");
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleUploadToDatabase = async () => {
    try {
      setUploading(true); // Show loading while uploading data
      const response = await axios.post("/api/upload", { data });
      console.log("Data successfully uploaded:", response.data);
      setUploading(false); // Hide loading after upload
    } catch (error) {
      console.error("Error uploading data:", error);
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-blue-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Upload a File</h2>
        <input
          type="file"
          accept=".csv, .xls, .xlsx"
          onChange={handleFileChange}
          className="block w-full mb-4 text-gray-700 border border-gray-300 rounded-md p-2 focus:outline-none"
        />

        {error && <div className="mb-4 text-red-600">{error}</div>}
        {loading && <div className="text-center text-blue-600 mb-4">Loading...</div>}

        {data.length > 0 && (
          <>
            <div className="overflow-y-auto max-h-64 mb-4 border border-gray-300">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-200">
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} className="p-4 border-b text-left font-semibold">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, rowsToShow).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      {Object.keys(row).map((key) => (
                        <td key={key} className="p-4 border-b">
                          {row[key] as React.ReactNode}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.length > rowsToShow && (
              <button
                onClick={() => setRowsToShow(rowsToShow + 100)}
                className="block w-full p-2 bg-blue-600 text-white rounded-md font-semibold"
              >
                Load More
              </button>
            )}

            <button
              onClick={handleUploadToDatabase}
              disabled={uploading}
              className={`block w-full p-2 bg-blue-600 text-white rounded-md font-semibold ${
                uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload to Database"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;