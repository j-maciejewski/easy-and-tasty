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
  AddCategoryForm,
  ConditionalDialog,
  DataTable,
  DropdownActions,
  EditCategoryForm,
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
  const [editedCategory, setEditedCategory] = useState<number | null>(null);

  const {
    data: categories,
    isLoading,
    error,
  } = api.authorized.category.getCategories.useQuery();
  const deleteCategory = api.authorized.category.deleteCategory.useMutation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!categories) return;

    if (
      (pagination.currentPage - 1) * pagination.itemsPerPage >
      categories.length
    )
      redirect(Path.DASHBOARD_CATEGORIES);

    setTotalItemsCount(categories.length);
  }, [categories]);

  async function handleDeleteCategory(id: number) {
    try {
      await deleteCategory.mutateAsync(id);

      toast.success("Category was deleted.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
        "There was an error while deleting the category.",
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
    render: (category: NonNullable<typeof categories>[number]) => ReactNode;
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
                <button type="button" onClick={() => setEditedCategory(id)}>
                  Edit Category
                </button>
              ) : (
                <Link href={`${Path.DASHBOARD_CATEGORIES}/edit/${id}`}>
                  Edit Category
                </Link>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleDeleteCategory(id)}
            >
              Delete Category
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
  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    const filteredCategories =
      searchTerm !== ""
        ? categories?.filter((category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        : [...categories];

    if (sortField !== undefined) {
      if (sortField === "id") {
        if (sortDir === "asc") {
          filteredCategories.sort((a, b) => a.id - b.id);
        } else {
          filteredCategories.sort((a, b) => b.id - a.id);
        }
      } else {
        if (sortDir === "asc") {
          filteredCategories.sort((a, b) => {
            const aValue = (
              a[sortField as keyof typeof a] as string
            ).toUpperCase();
            const bValue = (
              b[sortField as keyof typeof b] as string
            ).toUpperCase();
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          });
        } else {
          filteredCategories.sort((a, b) => {
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

    return filteredCategories;
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    searchTerm,
    categories,
    sortDir,
    sortField,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!categories || categories.length === filteredCategories.length) return;

    handleChangePage(1);
    handleChangeLimit(10);
    setTotalItemsCount(filteredCategories.length);
  }, [filteredCategories.length]);

  const addCategoryDialogCloseRef = useRef<HTMLButtonElement>(null);

  return (
    <ErrorCatcher errors={[error] as (Error | null)[]}>
      <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 w-full md:mb-0 md:w-1/3">
          <Input
            type="search"
            placeholder="Search categories..."
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
            title="Add category"
            trigger={
              <Button className="relative aspect-square" variant="secondary">
                <Plus className="absolute size-5 stroke-2 text-foreground" />
              </Button>
            }
            dialogRef={addCategoryDialogCloseRef}
            showDialog={settings.formsInModals}
            content={
              <AddCategoryForm
                onSubmit={() => addCategoryDialogCloseRef.current?.click()}
              />
            }
            link={Path.DASHBOARD_NEW_CATEGORY}
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
        data={filteredCategories.slice(
          (pagination.currentPage - 1) * pagination.itemsPerPage,
          pagination.currentPage * pagination.itemsPerPage,
        )}
        sortDir={sortDir}
        sortField={sortField}
        setSortDir={setSortDir}
        setSortField={setSortField}
      />

      <Dialog
        open={editedCategory !== null}
        onOpenChange={() => setEditedCategory(null)}
      >
        <DialogContent className="max-h-[calc(100%_-_4rem)] overflow-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <EditCategoryForm
            categoryId={editedCategory!}
            onSubmit={() => setEditedCategory(null)}
          />
          <DialogClose />
        </DialogContent>
      </Dialog>
    </ErrorCatcher>
  );
}
