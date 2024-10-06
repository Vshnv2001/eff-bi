import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const FileUpload: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileType = file.type;
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileData = e.target?.result;

      if (fileType.includes("csv")) {
        Papa.parse(fileData as string, {
          header: true,
          complete: (results) => {
            setData(results.data);
            setError("");
          },
          error: () => {
            setError("Error parsing CSV file.");
          },
        });
      } else if (fileType.includes("sheet") || fileType.includes("excel")) {
        const workbook = XLSX.read(fileData, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
        setError("");
      } else {
        setError("Unsupported file format. Please upload a CSV or Excel file.");
      }
    };

    reader.readAsBinaryString(file);
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
        {data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  {Object.keys(data[0]).map((key) => (
                    <th
                      key={key}
                      className="p-4 border-b text-left font-semibold"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {Object.values(row).map((value, idx) => (
                      <td key={idx} className="p-4 border-b">
                        {value as React.ReactNode}{" "}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
