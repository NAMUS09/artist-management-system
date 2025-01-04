import React, { useRef } from "react";
import { CiImport } from "react-icons/ci";
import { Button } from "./ui/button";

// Function to parse CSV and return an object with dynamic keys
function parseCSV<T extends string>(
  data: string,
  headers: T[]
): { [K in T]: string }[] {
  const rows = data.trim().split("\n");

  const parsedHeaders = rows[0].split(",").map((header) => header.trim());

  if (!parsedHeaders.every((header, index) => header === headers[index])) {
    throw new Error("CSV headers do not match the expected headers.");
  }

  const objects = rows.slice(1).map((row) => {
    const values = row
      .split(",")
      .map((value) => value.replace(/"/g, "").trim());

    // Ensure that each object has the correct type
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index];
      return acc;
    }, {} as { [K in T]: string });
  });

  return objects;
}

const ImportCSV = ({
  requiredKeys,
  handleImport,
  disabled,
}: {
  requiredKeys: string[];
  handleImport: (data: { [key: string]: string }[]) => void;
  disabled?: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for the file input

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target?.result as string;
        try {
          const parsedData = parseCSV(csvData, requiredKeys);

          if (validateKeys(parsedData)) {
            handleImport(parsedData);
          } else {
            alert("CSV is missing required keys or has invalid data.");
          }
        } catch (error) {
          alert(error);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please select a CSV file.");
    }
  }

  function validateKeys(data: { [key: string]: string }[]) {
    if (!data.length) return false;

    const csvKeys = Object.keys(data[0]);
    return requiredKeys.every((key) => csvKeys.includes(key));
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      <Button onClick={handleButtonClick} disabled={disabled}>
        <CiImport />
        Import CSV
      </Button>
    </>
  );
};

export default ImportCSV;
