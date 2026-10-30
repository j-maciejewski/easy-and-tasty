import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
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
import { EmptyState, type EmptyStateProps } from "./tables/shared/EmptyState";
import type { TableColumn } from "./tables/shared/types";

const SKELETON_WIDTHS = [
  "w-32",
  "w-24",
  "w-40",
  "w-16",
  "w-28",
  "w-20",
  "w-36",
];

const getDefaultRowKey = (item: unknown, idx: number): React.Key => {
  const id = (item as { id?: unknown } | null)?.id;
  return typeof id === "string" || typeof id === "number" ? id : idx;
};

export namespace DataTable {
  export interface Props<T> {
    isLoading?: boolean;
    hiddenColumns: string[];
    data: T[];
    columns: TableColumn<T>[];
    getRowKey?: (item: T) => React.Key;
    emptyState?: EmptyStateProps;
  }
}

export const DataTable = <T,>({
  isLoading = false,
  hiddenColumns,
  columns,
  data,
  getRowKey,
  emptyState,
}: DataTable.Props<T>) => {
  const { pagination, sort, handleChangeSort } = use(PaginationContext)!;

  if (!isLoading && data.length === 0) return <EmptyState {...emptyState} />;

  const visibleColumns = columns.filter(
    (column) => !hiddenColumns.includes(column.label),
  );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => {
              const isRight = column.align === "right";
              const isActive = !!column.sortKey && sort.key === column.sortKey;
              const SortIcon = isActive
                ? sort.order === "asc"
                  ? ArrowUp
                  : ArrowDown
                : ArrowUpDown;

              return (
                <TableHead
                  key={column.label}
                  className={cn(
                    "text-foreground/50 select-none",
                    isRight && "text-right",
                  )}
                  aria-sort={
                    column.sortKey
                      ? isActive
                        ? sort.order === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                      : undefined
                  }
                >
                  {column.sortKey ? (
                    <button
                      type="button"
                      onClick={() => handleChangeSort(column.sortKey as string)}
                      className={cn(
                        "hover:text-foreground focus-visible:ring-ring/50 -mx-1 inline-flex items-center gap-1.5 rounded-sm px-1 py-0.5 outline-none focus-visible:ring-[3px]",
                        isRight && "flex-row-reverse",
                        isActive && "text-foreground",
                      )}
                    >
                      {column.label}
                      <SortIcon
                        aria-hidden
                        className={cn("size-3.5", !isActive && "opacity-40")}
                      />
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from(Array(pagination.itemsPerPage).keys()).map((idx) => (
                <TableRow key={idx}>
                  {visibleColumns.map((column, colIdx) => (
                    <TableCell key={column.label}>
                      <Skeleton
                        className={cn(
                          "h-5 rounded-full",
                          column.align === "right"
                            ? "ml-auto w-10"
                            : SKELETON_WIDTHS[colIdx % SKELETON_WIDTHS.length],
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : data.map((item, idx) => (
                <TableRow
                  key={getRowKey?.(item) ?? getDefaultRowKey(item, idx)}
                >
                  {visibleColumns.map((column) => (
                    <TableCell
                      key={column.label}
                      className={cn(
                        "font-medium",
                        column.align === "right" && "text-right tabular-nums",
                      )}
                    >
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
