import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { use } from "react";
import { PaginationContext } from "../_context";
import { Pagination } from "./Pagination";

namespace DataTable {
  export interface Props<T> {
    isLoading: boolean;
    hiddenColumns: string[];
    data: T[];
    columns: {
      label: string;
      render: (item: T) => React.ReactNode;
      sortKey?: string;
    }[];
    sortField: string | undefined;
    setSortField: (value: React.SetStateAction<string | undefined>) => void;
    sortDir: "desc" | "asc";
    setSortDir: (value: React.SetStateAction<"desc" | "asc">) => void;
  }
}

export const DataTable = <T,>({
  isLoading,
  hiddenColumns,
  columns,
  data,
  sortDir,
  sortField,
  setSortDir,
  setSortField,
}: DataTable.Props<T>) => {
  const { pagination, handleChangePage } = use(PaginationContext)!;

  const toggleSort = (field: string) => {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else {
        setSortDir("asc");
        setSortField(undefined);
      }
      handleChangePage(1);
      return;
    }

    setSortField(field);
    setSortDir("asc");
    handleChangePage(1);
  };

  if (!isLoading && data.length === 0) return <>No results</>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns
              .filter((column) => !hiddenColumns.includes(column.label))
              .map((column) => (
                <TableHead
                  key={column.label}
                  className={cn(
                    "select-none text-foreground/50",
                    column.sortKey && "cursor-pointer hover:bg-muted",
                  )}
                  {...(column.sortKey
                    ? {
                        onClick: () => toggleSort(column.sortKey as string),
                      }
                    : {})}
                >
                  <span className="flex items-center justify-between">
                    {column.label}
                    {column.sortKey &&
                      sortField === column.sortKey &&
                      (sortDir === "asc" ? <ChevronUp /> : <ChevronDown />)}
                  </span>
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from(Array(pagination.itemsPerPage).keys()).map((idx) => (
                <TableRow key={idx}>
                  {columns
                    .filter((column) => !hiddenColumns.includes(column.label))
                    .map((column) => (
                      <TableCell key={column.label}>
                        <Skeleton className="h-[20px] w-[200px] rounded-full" />
                      </TableCell>
                    ))}
                </TableRow>
              ))
            : data.map((item, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <TableRow key={idx}>
                  {columns
                    .filter((column) => !hiddenColumns.includes(column.label))
                    .map((column) => (
                      <TableCell key={column.label} className="font-medium">
                        {column.render(item)}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
      {!isLoading && <Pagination />}
    </>
  );
};
