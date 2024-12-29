export const exportToCSV = <T extends Record<string, number | string>>(
  data: T[],
  filename = "export.csv"
) => {
  const csvRows: string[] = [];

  // Get the headers from the first object
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  // Add the data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      // Escape commas and quotes in values
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }

  // Create a Blob from the CSV data
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });

  // Create a link to download the file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  // Programmatically click the link to trigger the download
  link.click();
};
