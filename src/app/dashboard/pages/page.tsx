"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ChevronDown, ChevronUp, Columns3, Menu, Plus, X } from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
// import { AddpageForm } from "../_components/AddpageForm";
import { MultiSelect } from "../_components/Multiselect";

export default function () {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [resultsPerQuery, setResultsPerQuery] = useState(10);
  const [page, setPage] = useState(1);

  const updateResultsPerQuery = (value: number) => {
    setResultsPerQuery(value);
    setPage(1);
  };

  const {
    data: pages,
    isLoading,
    error,
  } = api.protected.page.getPages.useQuery();

  const toggleSort = (field: string) => {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else {
        setSortDir("asc");
        setSortField(undefined);
      }
      setPage(1);
      return;
    }

    setSortField(field);
    setSortDir("asc");
    setPage(1);
  };

  const [columns, setColumns] = useState<
    {
      label: string;
      render: (page: NonNullable<typeof pages>[number]) => ReactNode;
      sortKey?: string;
      hidden?: boolean;
    }[]
  >([
    {
      label: "Title",
      sortKey: "title",
      render: (page) => page.title,
    },
    {
      label: "Slug",
      sortKey: "slug",
      render: (page) => page.slug,
    },
    {
      label: "Created At",
      render: (page) => new Date(page.createdAt).toLocaleString(),
      hidden: true,
    },
    {
      label: "Updated At",
      render: (page) =>
        page.updatedAt ? new Date(page.updatedAt).toLocaleString() : null,
      hidden: true,
    },
    {
      label: "Published At",
      render: (page) =>
        page.updatedAt ? new Date(page.updatedAt).toLocaleString() : null,
    },
    {
      label: "Actions",
      render: (page) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View Page</DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/pages/edit/${page.id}`}>Edit Page</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Publish page
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Delete page
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]);

  const toggleColumn = (toggledColumn: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        hidden: toggledColumn === column.label ? !column.hidden : column.hidden,
      })),
    );
  };

  const addpageDialogCloseRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {error ? (
        <div>{JSON.stringify(error)}</div>
      ) : (
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 w-full md:mb-0 md:w-1/3">
                <Input
                  type="search"
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex gap-4">
                <MultiSelect
                  options={columns.map((column) => ({
                    label: column.label,
                    value: column.label,
                    checked: !column.hidden,
                  }))}
                  toggleOption={toggleColumn}
                >
                  <Button variant="outline" className="aspect-square">
                    <Columns3 className="absolute size-5" />
                  </Button>
                </MultiSelect>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="relative aspect-square"
                      variant="secondary"
                    >
                      <Plus className="absolute size-5 stroke-2 text-foreground" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[calc(100%_-_4rem)] overflow-auto sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add page</DialogTitle>
                    </DialogHeader>
                    {/* <AddpageForm
                      onSubmit={() => addpageDialogCloseRef.current?.click()}
                    /> */}
                    <DialogClose ref={addpageDialogCloseRef} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="mb-6 empty:hidden">
              {debouncedSearchTerm && (
                <Badge
                  variant="outline"
                  className="cursor-pointer"
                  tabIndex={0}
                  onClick={clearSearch}
                >
                  Query: {debouncedSearchTerm}{" "}
                  <X className="h-4 text-red-600" />
                </Badge>
              )}
            </div>

            {isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns
                      .filter((column) => !column.hidden)
                      .map((column) => (
                        <TableCell key={column.label}>{column.label}</TableCell>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from(Array(10).keys()).map((idx) => (
                    <TableRow key={idx}>
                      {columns
                        .filter((column) => !column.hidden)
                        .map((column) => (
                          <TableCell key={column.label}>
                            <Skeleton className="h-[20px] w-[200px] rounded-full" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : pages?.length !== undefined && pages?.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns
                        .filter((column) => !column.hidden)
                        .map((column) => (
                          <TableHead
                            key={column.label}
                            className={cn(
                              "select-none",
                              column.sortKey &&
                                "cursor-pointer hover:bg-gray-200/50",
                            )}
                            {...(column.sortKey
                              ? {
                                  onClick: () =>
                                    toggleSort(column.sortKey as string),
                                }
                              : {})}
                          >
                            <span className="flex justify-between">
                              {column.label}
                              {column.sortKey &&
                                sortField === column.sortKey &&
                                (sortDir === "asc" ? (
                                  <ChevronUp />
                                ) : (
                                  <ChevronDown />
                                ))}
                            </span>
                          </TableHead>
                        ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages?.map((page) => (
                      <TableRow key={page.id}>
                        {columns
                          .filter((column) => !column.hidden)
                          .map((column) => (
                            <TableCell
                              key={column.label}
                              className="font-medium"
                            >
                              {column.render(page)}
                            </TableCell>
                          ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              "No pages"
            )}
          </div>
        </main>
      )}
    </>
  );
}
