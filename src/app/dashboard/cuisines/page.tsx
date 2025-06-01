"use client";

import {
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DropdownMenuItem,
  Input,
} from "@/components/ui";
import { Path } from "@/config";
import { api } from "@/trpc/react";
import { Columns3, Plus, X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode, use, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AddCuisineForm,
  ConditionalDialog,
  DataTable,
  DropdownActions,
  EditCuisineForm,
  ErrorCatcher,
  MultiSelect,
} from "../_components";
import { PaginationContext, UserContext } from "../_context";

export default function () {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    pagination,
    setTotalItemsCount,
    handleChangePage,
    handleChangeLimit,
  } = use(PaginationContext)!;
  const { settings } = use(UserContext)!;
  const [editedCuisine, setEditedCuisine] = useState<number | null>(null);

  const {
    data: cuisines,
    isLoading,
    error,
  } = api.authorized.cuisine.getCuisines.useQuery();
  const deleteCuisine = api.authorized.cuisine.deleteCuisine.useMutation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!cuisines) return;

    if (
      (pagination.currentPage - 1) * pagination.itemsPerPage >
      cuisines.length
    )
      redirect(Path.DASHBOARD_CUISINES);

    setTotalItemsCount(cuisines.length);
  }, [cuisines]);

  async function handleDeleteCuisine(id: number) {
    try {
      await deleteCuisine.mutateAsync(id);

      toast.success("Cuisine was deleted.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while deleting the cuisine.",
      );
    }
  }

  const clearSearch = () => {
    setSearchTerm("");
  };

  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const columns: {
    label: string;
    render: (cuisine: NonNullable<typeof cuisines>[number]) => ReactNode;
    sortKey?: string;
    hidden?: boolean;
  }[] = [
    {
      label: "Name",
      sortKey: "name",
      render: ({ name }) => name,
    },
    {
      label: "Slug",
      sortKey: "slug",
      render: ({ slug }) => slug,
    },
    {
      label: "Description",
      sortKey: "description",
      render: ({ description }) => description,
    },
    {
      label: "Actions",
      render: ({ id }) => (
        <DropdownActions>
          <DropdownMenuItem>
            {settings.formsInModals ? (
              <button type="button" onClick={() => setEditedCuisine(id)}>
                Edit Cuisine
              </button>
            ) : (
              <Link href={`${Path.DASHBOARD_CUISINES}/edit/${id}`}>
                Edit Cuisine
              </Link>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => handleDeleteCuisine(id)}
          >
            Delete Cuisine
          </DropdownMenuItem>
        </DropdownActions>
      ),
    },
  ];

  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  const toggleColumn = (toggledColumn: string) => {
    setHiddenColumns((prev) => {
      if (prev.includes(toggledColumn)) {
        return prev.filter((column) => column !== toggledColumn);
      }
      return [...prev, toggledColumn];
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const filteredCuisines = useMemo(() => {
    if (!cuisines) return [];

    const filteredCuisines =
      searchTerm !== ""
        ? cuisines?.filter((cuisine) =>
            cuisine.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : [...cuisines];

    if (sortField !== undefined) {
      if (sortField === "id") {
        if (sortDir === "asc") {
          filteredCuisines.sort((a, b) => a.id - b.id);
        } else {
          filteredCuisines.sort((a, b) => b.id - a.id);
        }
      } else {
        if (sortDir === "asc") {
          filteredCuisines.sort((a, b) => {
            const aValue = (
              a[sortField as keyof typeof a] as string
            ).toUpperCase();
            const bValue = (
              b[sortField as keyof typeof b] as string
            ).toUpperCase();
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          });
        } else {
          filteredCuisines.sort((a, b) => {
            const aValue = (
              a[sortField as keyof typeof a] as string
            ).toUpperCase();
            const bValue = (
              b[sortField as keyof typeof b] as string
            ).toUpperCase();
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
          });
        }
      }
    }

    return filteredCuisines;
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    searchTerm,
    cuisines,
    sortDir,
    sortField,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!cuisines || cuisines.length === filteredCuisines.length) return;

    handleChangePage(1);
    handleChangeLimit(10);
    setTotalItemsCount(filteredCuisines.length);
  }, [filteredCuisines.length]);

  const addCuisineDialogCloseRef = useRef<HTMLButtonElement>(null);

  return (
    <ErrorCatcher errors={[error] as (Error | null)[]}>
      <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 w-full md:mb-0 md:w-1/3">
          <Input
            type="search"
            placeholder="Search cuisines..."
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
            <Button variant="outline" className="relative aspect-square">
              <Columns3 className="absolute size-5" />
            </Button>
          </MultiSelect>
          <ConditionalDialog
            title="Add cuisine"
            trigger={
              <Button className="relative aspect-square" variant="secondary">
                <Plus className="absolute size-5 stroke-2 text-foreground" />
              </Button>
            }
            dialogRef={addCuisineDialogCloseRef}
            showDialog={settings.formsInModals}
            content={
              <AddCuisineForm
                onSubmit={() => addCuisineDialogCloseRef.current?.click()}
              />
            }
            link={Path.DASHBOARD_NEW_CUISINE}
          />
        </div>
      </div>
      <div className="mb-6 empty:hidden">
        {searchTerm && (
          <Badge
            variant="outline"
            className="cursor-pointer"
            tabIndex={0}
            onClick={clearSearch}
          >
            Query: {searchTerm} <X className="h-4 text-red-600" />
          </Badge>
        )}
      </div>

      <DataTable
        isLoading={isLoading}
        hiddenColumns={hiddenColumns}
        columns={columns}
        data={filteredCuisines.slice(
          (pagination.currentPage - 1) * pagination.itemsPerPage,
          pagination.currentPage * pagination.itemsPerPage,
        )}
        sortDir={sortDir}
        sortField={sortField}
        setSortDir={setSortDir}
        setSortField={setSortField}
      />

      <Dialog
        open={editedCuisine !== null}
        onOpenChange={() => setEditedCuisine(null)}
      >
        <DialogContent className="max-h-[calc(100%_-_4rem)] overflow-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Cuisine</DialogTitle>
          </DialogHeader>
          <EditCuisineForm
            cuisineId={editedCuisine!}
            onSubmit={() => setEditedCuisine(null)}
          />
          <DialogClose />
        </DialogContent>
      </Dialog>
    </ErrorCatcher>
  );
}
