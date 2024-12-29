import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import ExportCSVButton from "./ExportCSV";
import { Button } from "./ui/button";
import { DataTable } from "./ui/data-table";

type TableLayoutProps<T> = {
  heading: string;
  addText: string;
  data: T[] | undefined;
  isLoading: boolean;
  columns: ColumnDef<T>[];
  handleAdd: () => void;
  fileName?: string;
  children?: React.ReactNode;
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
}: TableLayoutProps<T>) => {
  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">{heading}</h1>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <>
          <div className="flex gap-2">
            <Button onClick={handleAdd}>
              {" "}
              <Plus />
              {addText}
            </Button>
            <ExportCSVButton
              data={(data as Record<string, number | string>[]) ?? []}

              fileName={fileName ?? "export.csv"}
            />
          </div>

          <div className="mt-5">
            <DataTable columns={columns} data={data ?? []} />
          </div>
        </>
      )}
      {children}
    </div>
  );
};

export default TableLayout;
