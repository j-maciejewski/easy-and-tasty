"use client";

import { Columns3, Plus, X } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode, use, useEffect, useMemo, useState } from "react";

import {
  AddCategoryForm,
  DataTable,
  DropdownActions,
  EditCategoryForm,
  GenericConfirmModal,
  GenericModal,
  MultiSelect,
} from "@/components/dashboard";
import { Badge, Button, DropdownMenuItem, Input } from "@/components/ui";
import { Path } from "@/config";
import { CategoriesContext, PaginationContext } from "@/context";
import {
  searchItems,
  sortItems,
  useCategoriesActions,
  useColumnsToggler,
  useSearchQuery,
} from "@/utils";

export default function () {
  const { query, setQuery, clearQuery } = useSearchQuery();
  const {
    sort,
    pagination,
    setTotalItemsCount,
    handleChangePage,
    handleChangeLimit,
  } = use(PaginationContext)!;
  const { categories, categoriesLoading, refreshCategories } =
    use(CategoriesContext)!;

  const [action, setAction] = useState<
    | {
        type: "publish" | "unpublish" | "delete" | "edit";
        categoryId: number;
      }
    | { type: "add" }
    | null
  >(null);

  const clearAction = () => setAction(null);

  const {
    handleDeleteCategory,
    handlePublishCategory,
    handleUnpublishCategory,
  } = useCategoriesActions();

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!categories) return;

    if (
      (pagination.currentPage - 1) * pagination.itemsPerPage >
      categories.size
    )
      redirect(Path.DASHBOARD_CATEGORIES);

    setTotalItemsCount(categories.size);
  }, [categories]);

  type ColumnLabel =
    | "Name"
    | "Slug"
    | "Description"
    | "Status"
    | "Published at"
    | "Actions";

  const columns: {
    label: ColumnLabel;
    render: (category: Category) => ReactNode;
    sortKey?: string;
    defaultHidden?: boolean;
  }[] = [
    {
      label: "Name" as const,
      sortKey: "name",
      render: ({ name }) => name,
    },
    {
      label: "Slug" as const,
      sortKey: "slug",
      render: ({ slug }) => (
        <span className="text-muted-foreground">{slug}</span>
      ),
    },
    {
      label: "Description",
      sortKey: "description",
      render: ({ description }) => description,
    },
    {
      label: "Status",
      render: ({ publishedAt }) =>
        publishedAt ? (
          <Badge variant="secondary">Published</Badge>
        ) : (
          <Badge variant="secondary">Draft</Badge>
        ),
    },
    {
      label: "Published at",
      sortKey: "publishedAt",
      render: ({ publishedAt }) =>
        publishedAt ? new Date(publishedAt).toLocaleString() : null,
      defaultHidden: true,
    },
    {
      label: "Actions",
      render: ({ id, publishedAt }) => (
        <DropdownActions>
          <DropdownMenuItem
            onClick={() => setAction({ type: "edit", categoryId: id })}
          >
            Edit Category
          </DropdownMenuItem>
          {publishedAt ? (
            <DropdownMenuItem
              onClick={() => setAction({ type: "unpublish", categoryId: id })}
            >
              Unpublish Category
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setAction({ type: "publish", categoryId: id })}
            >
              Publish Category
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setAction({ type: "delete", categoryId: id })}
          >
            Delete Category
          </DropdownMenuItem>
        </DropdownActions>
      ),
    },
  ];

  const { hiddenColumns, toggleColumn } = useColumnsToggler(
    columns
      .filter((column) => column.defaultHidden)
      .map((column) => column.label),
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    const filteredCategories = searchItems(
      [...categories.values()],
      ["name", "slug", "description"],
      query,
    );

    sortItems(filteredCategories, sort.key as keyof Category, sort.order);

    return filteredCategories;
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    query,
    categories,
    sort.key,
    sort.order,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (categories.size === filteredCategories.length) return;

    handleChangePage(1);
    handleChangeLimit(10);
    setTotalItemsCount(filteredCategories.length);
  }, [filteredCategories.length]);

  return (
    <div>
      <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 w-full md:mb-0 md:w-1/3">
          <Input
            type="search"
            placeholder="Search categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <MultiSelect
            options={columns.map((column) => ({
              label: column.label,
              value: column.label,
              checked: !hiddenColumns.includes(column.label),
            }))}
            toggleOption={toggleColumn}
          >
            <Button variant="ghost" className="relative aspect-square">
              <Columns3 className="absolute size-5" />
            </Button>
          </MultiSelect>
          <Button
            className="relative aspect-square"
            variant="secondary"
            onClick={() => setAction({ type: "add" })}
          >
            <Plus className="absolute size-5 stroke-2 text-foreground" />
          </Button>
        </div>
      </div>
      <div className="mb-6 empty:hidden">
        {query && (
          <Badge
            variant="outline"
            className="cursor-pointer"
            tabIndex={0}
            onClick={clearQuery}
          >
            Query: {query} <X className="h-4 text-red-600" />
          </Badge>
        )}
      </div>

      <DataTable
        isLoading={categoriesLoading}
        hiddenColumns={hiddenColumns}
        columns={columns}
        data={filteredCategories.slice(
          (pagination.currentPage - 1) * pagination.itemsPerPage,
          pagination.currentPage * pagination.itemsPerPage,
        )}
      />

      {action?.type === "add" && (
        <GenericModal
          title="New category"
          open={action?.type === "add"}
          handleClose={clearAction}
          content={
            <AddCategoryForm
              onSubmit={() => {
                clearAction();
                refreshCategories();
              }}
            />
          }
        />
      )}

      {action?.type === "edit" && (
        <GenericModal
          title="Edit category"
          open={action?.type === "edit"}
          handleClose={clearAction}
          content={
            <EditCategoryForm
              categoryId={action?.categoryId}
              onSubmit={() => {
                clearAction();
                refreshCategories();
              }}
            />
          }
        />
      )}

      {action?.type === "publish" && (
        <GenericConfirmModal
          title="Publish category?"
          open={action?.type === "publish"}
          handleClose={clearAction}
          handleConfirm={() => {
            handlePublishCategory(action?.categoryId!);
            clearAction();
          }}
        />
      )}

      {action?.type === "unpublish" && (
        <GenericConfirmModal
          title="Unpublish category?"
          open={action?.type === "unpublish"}
          handleClose={clearAction}
          handleConfirm={() => {
            handleUnpublishCategory(action?.categoryId!);
            clearAction();
          }}
        />
      )}

      {action?.type === "delete" && (
        <GenericConfirmModal
          title="Delete category?"
          open={action?.type === "delete"}
          description="This action cannot be undone."
          handleClose={clearAction}
          handleConfirm={() => {
            handleDeleteCategory(action?.categoryId!);
            clearAction();
          }}
        />
      )}
    </div>
  );
}
