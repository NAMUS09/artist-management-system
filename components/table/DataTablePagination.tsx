/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type PaginationTableContextValue = {
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
  fetchPreviousPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
  hasNextPage: boolean;
};

const PaginationTableContext = createContext<PaginationTableContextValue>(
  {} as PaginationTableContextValue
);

export type PaginationTableProps = PaginationTableContextValue & {
  children: React.ReactNode;
};

export const PaginationTable: React.FC<PaginationTableProps> = ({
  setPageSize,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  children,
}) => {
  return (
    <PaginationTableContext
      value={{ setPageSize, fetchNextPage, fetchPreviousPage, hasNextPage }}
    >
      {children}
    </PaginationTableContext>
  );
};

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const paginationContext = useContext(PaginationTableContext);

  if (!paginationContext) {
    throw new Error(
      "usePagination must be used within a PaginationTableProvider."
    );
  }

  const { setPageSize, fetchNextPage, fetchPreviousPage, hasNextPage } =
    paginationContext;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected. */}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              const pageSize = Number(value);
              setPageSize(pageSize);
              table.setPageSize(pageSize);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              fetchPreviousPage();
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              fetchNextPage();
              table.setPageIndex(table.getPageCount() - 1);
            }}
            disabled={!table.getCanNextPage() || !hasNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
