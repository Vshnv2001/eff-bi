self.onmessage = (e: MessageEvent) => {
  const { fileData, fileType } = e.data;

  console.log("Received data:", { fileData, fileType });

  if (fileType.includes("csv")) {
    self.postMessage({ type: "error", message: "PapaParse must be handled in the main thread." });
  } else if (fileType.includes("sheet") || fileType.includes("excel")) {
    try {
      const XLSX = (self as any).XLSX;
      
      // Add logging to verify the data type
      console.log("Reading Excel file...");
      const workbook = XLSX.read(fileData, { type: "binary" });
      
      console.log("Workbook loaded:", workbook);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Check if the worksheet exists
      if (!worksheet) {
        self.postMessage({ type: "error", message: "Worksheet not found." });
        return;
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log("Parsed JSON data:", jsonData);
      self.postMessage({ type: "complete", data: jsonData });
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      self.postMessage({ type: "error", message: "Error parsing Excel file." });
    }
  } else {
    self.postMessage({ type: "error", message: "Unsupported file format." });
  }
};