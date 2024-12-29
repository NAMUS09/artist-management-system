import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

const appendActionColumn = <T,>(
  columns: ColumnDef<T>[],
  handleEdit: (data: T) => void,
  handleDelete: (data: T) => void
): ColumnDef<T>[] => {
  return [
    ...columns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const currentRow = row.original as T; // Ensure proper typing
        return (
          <div className="flex gap-2">
            {" "}
            {/* JSX div element */}
            <Button
              size="icon"
              variant="ghost"
              title="Edit"
              onClick={() => handleEdit(currentRow)}
            >
              <Pencil className="text-green-500" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              title="Delete"
              onClick={() => handleDelete(currentRow)}
            >
              <Trash2 className="text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];
};

export default appendActionColumn;
