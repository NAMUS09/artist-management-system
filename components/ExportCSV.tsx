import { exportToCSV } from "@/app/utils/exportCSV";
import { CiExport } from "react-icons/ci";
import { Button } from "./ui/button";

const ExportCSVButton = <T extends Record<string, number | string>>({
  data,
  fileName = "export.csv",
}: {
  data: T[];
  fileName?: string;
}) => {
  const handleExport = () => {
    exportToCSV(data, fileName);
  };

  return (
    <Button onClick={handleExport} disabled={data.length === 0}>
      <CiExport />
      Export as CSV
    </Button>
  );
};

export default ExportCSVButton;
