import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import ExportCSVButton from "./ExportCSV";
import ImportCSV from "./ImportCSV";
import { DataTable } from "./table/data-table";
import { Button } from "./ui/button";

type TableLayoutProps<T> = {
  heading: string;
  addText: string;
  data: T[] | undefined;
  isLoading: boolean;
  columns: ColumnDef<T>[];
  handleAdd: () => void;
  fileName?: string;
  children?: React.ReactNode;
  requiredKeys?: string[];
  handleImport: (data: { [key: string]: string }[]) => void;
};

const TableLayout = <T,>({
  heading,
  addText,
  data,
  isLoading,
  columns,
  handleAdd,
  fileName,
  children,
  requiredKeys,
  handleImport,
}: TableLayoutProps<T>) => {
  return (
    <div className="container mx-auto p-3">
      <h1 className="text-2xl font-bold mb-2">{heading}</h1>

      <div className="flex gap-2">
        <Button disabled={isLoading} onClick={handleAdd}>
          {" "}
          <Plus />
          {addText}
        </Button>
        <ImportCSV
          requiredKeys={requiredKeys ?? []}
          disabled={isLoading}
          handleImport={handleImport}
        />

        <ExportCSVButton
          data={(data as Record<string, number | string>[]) ?? []}
          fileName={fileName ?? "export.csv"}
        />
      </div>

      <div className="mt-3">
        <DataTable columns={columns} data={data ?? []} isLoading={isLoading} />
      </div>

      {children}
    </div>
  );
};

export default TableLayout;
