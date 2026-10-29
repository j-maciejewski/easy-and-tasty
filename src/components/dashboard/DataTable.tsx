import { ChevronDown, ChevronUp } from "lucide-react";
import { use } from "react";

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { PaginationContext } from "@/context";
import { cn } from "@/lib/utils";

import { Pagination } from "./Pagination";

export namespace DataTable {
  export interface Props<T> {
    isLoading?: boolean;
    hiddenColumns: string[];
    data: T[];
    columns: {
      label: string;
      render: (item: T) => React.ReactNode;
      sortKey?: string;
    }[];
  }
}

export const DataTable = <T,>({
  isLoading = false,
  hiddenColumns,
  columns,
  data,
}: DataTable.Props<T>) => {
  const { pagination, sort, handleChangeSort } = use(PaginationContext)!;

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
                    "text-foreground/50 select-none",
                    column.sortKey && "hover:bg-muted cursor-pointer",
                  )}
                  {...(column.sortKey
                    ? {
                        onClick: () =>
                          handleChangeSort(column.sortKey as string),
                      }
                    : {})}
                >
                  <span className="flex items-center justify-between">
                    {column.label}
                    {column.sortKey &&
                      sort.key === column.sortKey &&
                      (sort.order === "asc" ? <ChevronUp /> : <ChevronDown />)}
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
                        <Skeleton className="h-5 w-[200px] rounded-full" />
                      </TableCell>
                    ))}
                </TableRow>
              ))
            : data.map((item, idx) => (
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
