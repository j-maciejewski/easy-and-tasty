"use client";

import { Columns3, Plus, X } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode, use, useEffect, useMemo, useState } from "react";

import {
  AddCuisineForm,
  DataTable,
  DropdownActions,
  EditCuisineForm,
  GenericConfirmModal,
  GenericModal,
  MultiSelect,
} from "@/components/dashboard";
import { Badge, Button, DropdownMenuItem, Input } from "@/components/ui";
import { Path } from "@/config";
import { CuisinesContext, PaginationContext } from "@/context";
import {
  searchItems,
  sortItems,
  useColumnsToggler,
  useCuisinesActions,
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
  const { cuisines, cuisinesLoading, refreshCuisines } = use(CuisinesContext)!;

  const [action, setAction] = useState<
    | {
        type: "publish" | "unpublish" | "delete" | "edit";
        cuisineId: number;
      }
    | { type: "add" }
    | null
  >(null);

  const clearAction = () => setAction(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!cuisines) return;

    if ((pagination.currentPage - 1) * pagination.itemsPerPage > cuisines.size)
      redirect(Path.DASHBOARD_CUISINES);

    setTotalItemsCount(cuisines.size);
  }, [cuisines]);

  const { handleDeleteCuisine, handlePublishCuisine, handleUnpublishCuisine } =
    useCuisinesActions();

  type ColumnLabel =
    | "Name"
    | "Slug"
    | "Description"
    | "Status"
    | "Published at"
    | "Actions";

  const columns: {
    label: ColumnLabel;
    render: (cuisine: Cuisine) => ReactNode;
    sortKey?: string;
  }[] = [
    {
      label: "Name",
      sortKey: "name",
      render: ({ name }) => name,
    },
    {
      label: "Slug",
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
    },
    {
      label: "Actions",
      render: ({ id, publishedAt }) => (
        <DropdownActions>
          <DropdownMenuItem
            onClick={() => setAction({ type: "edit", cuisineId: id })}
          >
            Edit Cuisine
          </DropdownMenuItem>
          {publishedAt ? (
            <DropdownMenuItem
              onClick={() => setAction({ type: "unpublish", cuisineId: id })}
            >
              Unpublish Cuisine
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setAction({ type: "publish", cuisineId: id })}
            >
              Publish Cuisine
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setAction({ type: "delete", cuisineId: id })}
          >
            Delete Cuisine
          </DropdownMenuItem>
        </DropdownActions>
      ),
    },
  ];

  const { hiddenColumns, toggleColumn } = useColumnsToggler<ColumnLabel>([
    "Published at",
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  const filteredCuisines = useMemo(() => {
    if (!cuisines) return [];

    const filteredCuisines = searchItems(
      [...cuisines.values()],
      ["name", "slug", "description"],
      query,
    );

    sortItems(filteredCuisines, sort.key as keyof Cuisine, sort.order);

    return filteredCuisines;
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    query,
    cuisines,
    sort.key,
    sort.order,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (cuisines.size === filteredCuisines.length) return;

    handleChangePage(1);
    handleChangeLimit(10);
    setTotalItemsCount(filteredCuisines.length);
  }, [filteredCuisines.length]);

  return (
    <div>
      <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 w-full md:mb-0 md:w-1/3">
          <Input
            type="search"
            placeholder="Search cuisines..."
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
        isLoading={cuisinesLoading}
        hiddenColumns={hiddenColumns}
        columns={columns}
        data={filteredCuisines.slice(
          (pagination.currentPage - 1) * pagination.itemsPerPage,
          pagination.currentPage * pagination.itemsPerPage,
        )}
      />

      {action?.type === "add" && (
        <GenericModal
          title="New cuisine"
          open={action?.type === "add"}
          handleClose={clearAction}
          content={
            <AddCuisineForm
              onSubmit={() => {
                clearAction();
                refreshCuisines();
              }}
            />
          }
        />
      )}

      {action?.type === "edit" && (
        <GenericModal
          title="Edit cuisine"
          open={action?.type === "edit"}
          handleClose={clearAction}
          content={
            <EditCuisineForm
              cuisineId={action?.cuisineId}
              onSubmit={() => {
                clearAction();
                refreshCuisines();
              }}
            />
          }
        />
      )}

      {action?.type === "publish" && (
        <GenericConfirmModal
          title="Publish cuisine?"
          open={action?.type === "publish"}
          handleClose={clearAction}
          handleConfirm={() => {
            handlePublishCuisine(action?.cuisineId!);
            clearAction();
          }}
        />
      )}

      {action?.type === "unpublish" && (
        <GenericConfirmModal
          title="Unpublish cuisine?"
          open={action?.type === "unpublish"}
          handleClose={clearAction}
          handleConfirm={() => {
            handleUnpublishCuisine(action?.cuisineId!);
            clearAction();
          }}
        />
      )}

      {action?.type === "delete" && (
        <GenericConfirmModal
          title="Delete cuisine?"
          open={action?.type === "delete"}
          description="This action cannot be undone."
          handleClose={clearAction}
          handleConfirm={() => {
            handleDeleteCuisine(action?.cuisineId!);
            clearAction();
          }}
        />
      )}
    </div>
  );
}
