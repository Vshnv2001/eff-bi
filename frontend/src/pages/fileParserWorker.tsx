self.onmessage = (e: MessageEvent) => {
  const { fileData, fileType } = e.data;

  if (fileType.includes("csv")) {
    // Assume PapaParse logic is passed from the main thread
    self.postMessage({ type: "error", message: "PapaParse must be handled in the main thread." });
  } else if (fileType.includes("sheet") || fileType.includes("excel")) {
    // Excel handling logic can be in the worker
    try {
      const XLSX = (self as any).XLSX; // Access XLSX from global context
      const workbook = XLSX.read(fileData, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      self.postMessage({ type: "complete", data: jsonData });
    } catch (error) {
      self.postMessage({ type: "error", message: "Error parsing Excel file." });
    }
  } else {
    self.postMessage({ type: "error", message: "Unsupported file format." });
  }
};