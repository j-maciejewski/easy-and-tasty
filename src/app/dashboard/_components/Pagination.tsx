"use client";

import { use, useMemo } from "react";

import {
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationRoot,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { getPaginationTiles } from "@/utils";

import { PaginationContext } from "../_context";

export const Pagination = () => {
  const {
    pagination: { currentPage, totalItemsCount, itemsPerPage },
    handleChangeLimit,
    handleChangePage,
  } = use(PaginationContext)!;

  const tiles = useMemo(
    () =>
      getPaginationTiles(
        currentPage,
        Math.ceil(totalItemsCount / itemsPerPage),
      ),
    [currentPage, totalItemsCount, itemsPerPage],
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItemsCount);
  const totalPages = Math.ceil(totalItemsCount / itemsPerPage);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between">
      <span className="text-nowrap text-muted-foreground text-sm">
        Showing <span className="font-semibold">{startItem}</span> to{" "}
        <span className="font-semibold">{endItem}</span> of{" "}
        <span className="font-semibold">{totalItemsCount}</span> results
      </span>
      <Select
        value={`${itemsPerPage}`}
        onValueChange={(value) => handleChangeLimit(Number(value))}
      >
        <SelectTrigger className="mr-4 ml-auto h-10 w-[180px] border">
          <SelectValue>Results shown: {itemsPerPage}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"10"}>10</SelectItem>
          <SelectItem value={"20"}>20</SelectItem>
          <SelectItem value={"50"}>50</SelectItem>
        </SelectContent>
      </Select>
      {totalPages !== 1 && (
        <PaginationRoot className="mx-0 h-10 w-fit rounded-lg border">
          <PaginationContent className="gap-0 [&>li:not(:first-child)]:border-l-2">
            <PaginationItem>
              <PaginationPrevious
                disabled={currentPage === 1}
                className="h-10 rounded-r-none"
                onClick={() => handleChangePage(currentPage - 1)}
              />
            </PaginationItem>
            {tiles.map((number, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: explanation
              <PaginationItem key={idx}>
                {number !== null ? (
                  <PaginationButton
                    className="size-10 rounded-none"
                    onClick={() => handleChangePage(number)}
                    isActive={currentPage === number}
                  >
                    {number}
                  </PaginationButton>
                ) : (
                  <PaginationEllipsis className="size-10" />
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                disabled={currentPage === totalPages}
                className="h-10 rounded-l-none"
                onClick={() => handleChangePage(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </PaginationRoot>
      )}
    </div>
  );
};
