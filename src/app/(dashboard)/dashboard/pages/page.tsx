"use client";

import { Columns3, Plus, X } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode, use, useEffect, useMemo, useState } from "react";

import {
  AddPageForm,
  DataTable,
  DropdownActions,
  EditPageForm,
  ErrorCatcher,
  GenericConfirmModal,
  GenericModal,
  MultiSelect,
} from "@/components/dashboard";
import { Badge, Button, DropdownMenuItem, Input } from "@/components/ui";
import { Path } from "@/config";
import { PaginationContext } from "@/context";
import { api } from "@/trpc/react";
import {
  searchItems,
  sortItems,
  useColumnsToggler,
  usePagesActions,
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

  const {
    data: pages,
    isLoading,
    error,
    refetch,
  } = api.authorized.page.getPages.useQuery();

  const [action, setAction] = useState<
    | {
        type: "publish" | "unpublish" | "delete" | "edit";
        pageId: number;
      }
    | { type: "add" }
    | null
  >(null);

  const clearAction = () => setAction(null);

  const { handleDeletePage, handlePublishPage, handleUnpublishPage } =
    usePagesActions();

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!pages) return;

    if ((pagination.currentPage - 1) * pagination.itemsPerPage > pages.length)
      redirect(Path.DASHBOARD_PAGES);

    setTotalItemsCount(pages.length);
  }, [pages]);

  type PageItem = NonNullable<typeof pages>[number];
  type ColumnLabel =
    | "Title"
    | "Slug"
    | "Description"
    | "Status"
    | "Created at"
    | "Updated at"
    | "Published at"
    | "Actions";

  const columns: {
    label: ColumnLabel;
    render: (page: PageItem) => ReactNode;
    sortKey?: string;
    defaultHidden?: boolean;
  }[] = [
    {
      label: "Title",
      sortKey: "title",
      render: (page) => page.title,
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
      label: "Created at",
      sortKey: "createdAt",
      render: (page) => new Date(page.createdAt).toLocaleString(),
      defaultHidden: true,
    },
    {
      label: "Updated at",
      sortKey: "updatedAt",
      render: (page) =>
        page.updatedAt ? new Date(page.updatedAt).toLocaleString() : null,
      defaultHidden: true,
    },
    {
      label: "Published at",
      sortKey: "publishedAt",
      render: (page) =>
        page.publishedAt ? new Date(page.publishedAt).toLocaleString() : null,
      defaultHidden: true,
    },
    {
      label: "Actions",
      render: (page) => (
        <DropdownActions>
          <DropdownMenuItem
            onClick={() => setAction({ type: "edit", pageId: page.id })}
          >
            Edit Page
          </DropdownMenuItem>
          {page.publishedAt ? (
            <DropdownMenuItem
              onClick={() => setAction({ type: "unpublish", pageId: page.id })}
            >
              Unpublish Page
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setAction({ type: "publish", pageId: page.id })}
            >
              Publish Page
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setAction({ type: "delete", pageId: page.id })}
          >
            Delete Page
          </DropdownMenuItem>
        </DropdownActions>
      ),
    },
  ];

  const { hiddenColumns, toggleColumn } = useColumnsToggler<ColumnLabel>(
    columns
      .filter((column) => column.defaultHidden)
      .map((column) => column.label),
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  const filteredPages = useMemo(() => {
    if (!pages) return [];

    const filteredPages = searchItems(
      pages,
      ["title", "slug", "description"],
      query,
    );

    sortItems(filteredPages, sort.key as keyof PageItem, sort.order);

    return filteredPages;
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    query,
    pages,
    sort.key,
    sort.order,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!pages || pages.length === filteredPages.length) return;

    handleChangePage(1);
    handleChangeLimit(10);
    setTotalItemsCount(filteredPages.length);
  }, [filteredPages.length, pages]);

  return (
    <ErrorCatcher errors={[error] as (Error | null)[]}>
      <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 w-full md:mb-0 md:w-1/3">
          <Input
            type="search"
            placeholder="Search pages..."
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
        isLoading={isLoading}
        hiddenColumns={hiddenColumns}
        columns={columns}
        data={filteredPages.slice(
          (pagination.currentPage - 1) * pagination.itemsPerPage,
          pagination.currentPage * pagination.itemsPerPage,
        )}
      />

      {action?.type === "add" && (
        <GenericModal
          title="New page"
          open={action?.type === "add"}
          handleClose={clearAction}
          content={
            <AddPageForm
              onSubmit={async () => {
                clearAction();
                await refetch();
              }}
            />
          }
        />
      )}

      {action?.type === "publish" && (
        <GenericConfirmModal
          title="Publish page?"
          open={action?.type === "publish"}
          handleClose={clearAction}
          handleConfirm={async () => {
            await handlePublishPage(action?.pageId!);
            clearAction();
            await refetch();
          }}
        />
      )}

      {action?.type === "edit" && (
        <GenericModal
          title="Edit page"
          open={action?.type === "edit"}
          handleClose={clearAction}
          content={
            <EditPageForm
              pageId={action?.pageId}
              onSubmit={async () => {
                clearAction();
                await refetch();
              }}
            />
          }
        />
      )}

      {action?.type === "unpublish" && (
        <GenericConfirmModal
          title="Unpublish page?"
          open={action?.type === "unpublish"}
          handleClose={clearAction}
          handleConfirm={async () => {
            await handleUnpublishPage(action?.pageId!);
            clearAction();
            await refetch();
          }}
        />
      )}

      {action?.type === "delete" && (
        <GenericConfirmModal
          title="Delete page?"
          open={action?.type === "delete"}
          description="This action cannot be undone."
          handleClose={clearAction}
          handleConfirm={async () => {
            await handleDeletePage(action?.pageId!);
            clearAction();
            await refetch();
          }}
        />
      )}
    </ErrorCatcher>
  );
}
