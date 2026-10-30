"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";

import {
  DataTable,
  ErrorCatcher,
  HomeSectionsEditor,
  SeoContent,
} from "@/components/dashboard";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { getDashboardArticlePath } from "@/config";
import { PaginationContext } from "@/context";
import { api } from "@/trpc/react";
import {
  matchesStatus,
  searchItems,
  sortItems,
  useArticlesActions,
  useColumnsToggler,
  useDebouncedSearchQuery,
  useModalAction,
  useStatusFilter,
  useWithReturnTo,
} from "@/utils";

import {
  ActiveFilter,
  AddButton,
  ColumnsToggler,
  DateCell,
  getTableEmptyState,
  ModalAction,
  SearchBar,
  SlugCell,
  StatusBadge,
  StatusFilter,
  TableColumn,
  TableDropdownActions,
  TableModals,
  TableToolbar,
} from "../shared";

export const ArticlesTable = () => {
  const [isHomeSectionsOpen, setHomeSectionsOpen] = useState(false);
  const [isSeoOpen, setSeoOpen] = useState(false);
  const { query, setQuery, debouncedQuery, clearQuery } =
    useDebouncedSearchQuery();
  const { status, setStatus, clearStatus } = useStatusFilter();
  const { sort, pagination, setTotalItemsCount, handleChangePage } =
    use(PaginationContext)!;

  const {
    data: pages,
    isLoading,
    error,
    refetch,
  } = api.authorized.article.getArticles.useQuery();

  const { action, setAction, clearAction } = useModalAction<ModalAction>();
  const router = useRouter();
  const withReturnTo = useWithReturnTo();
  const openEditor = (id: number | "new") =>
    router.push(withReturnTo(getDashboardArticlePath(id)));

  const { handleDeleteArticle, handlePublishArticle, handleUnpublishArticle } =
    useArticlesActions();

  type PageItem = NonNullable<typeof pages>[number];

  const columns: TableColumn<PageItem>[] = [
    {
      label: "Title",
      sortKey: "title",
      render: (page) => page.title,
    },
    {
      label: "Slug",
      sortKey: "slug",
      render: ({ slug }) => <SlugCell slug={slug} />,
    },
    {
      label: "Description",
      sortKey: "description",
      render: ({ description }) => description,
    },
    {
      label: "Status",
      render: ({ publishedAt }) => <StatusBadge isPublished={!!publishedAt} />,
    },
    {
      label: "Created at",
      sortKey: "createdAt",
      render: (page) => <DateCell date={page.createdAt} />,
      defaultHidden: true,
    },
    {
      label: "Updated at",
      sortKey: "updatedAt",
      render: (page) => <DateCell date={page.updatedAt} />,
      defaultHidden: true,
    },
    {
      label: "Published at",
      sortKey: "publishedAt",
      render: (page) => <DateCell date={page.publishedAt} />,
      defaultHidden: true,
    },
    {
      label: "Actions",
      render: (page) => (
        <TableDropdownActions
          actions={[
            {
              label: "Edit Article",
              onClick: () => openEditor(page.id),
            },
            page.publishedAt
              ? {
                  label: "Unpublish Article",
                  onClick: () => setAction({ type: "unpublish", id: page.id }),
                }
              : {
                  label: "Publish Article",
                  onClick: () => setAction({ type: "publish", id: page.id }),
                },
            {
              label: "Delete Article",
              onClick: () => setAction({ type: "delete", id: page.id }),
              variant: "destructive",
            },
          ]}
        />
      ),
    },
  ];

  const { hiddenColumns, toggleColumn } = useColumnsToggler(
    columns
      .filter(({ defaultHidden }) => defaultHidden)
      .map(({ label }) => label),
    "articles",
  );

  const clearFilters = () => {
    clearQuery();
    clearStatus();
  };

  const filteredPages = useMemo(() => {
    if (!pages) return [];

    const filteredPages = searchItems(
      pages.filter(({ publishedAt }) => matchesStatus(publishedAt, status)),
      ["title", "slug", "description"],
      debouncedQuery,
    );

    sortItems(filteredPages, sort.key as keyof PageItem, sort.order);

    return filteredPages;
  }, [debouncedQuery, status, pages, sort.key, sort.order]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!pages) return;

    setTotalItemsCount(filteredPages.length);

    if (
      pagination.currentPage > 1 &&
      (pagination.currentPage - 1) * pagination.itemsPerPage >=
        filteredPages.length
    )
      handleChangePage(1);
  }, [filteredPages.length, pages]);

  return (
    <ErrorCatcher errors={[error] as (Error | null)[]}>
      <div>
        <TableToolbar
          search={
            <SearchBar
              placeholder="Search articles..."
              value={query}
              onChange={setQuery}
            />
          }
          filters={<StatusFilter value={status} onChange={setStatus} />}
          actions={
            <>
              <ColumnsToggler
                columnNames={columns.map(({ label }) => label)}
                hiddenColumns={hiddenColumns}
                toggleColumn={toggleColumn}
              />
              <Button
                variant="outline"
                onClick={() => setHomeSectionsOpen(true)}
              >
                Home sections
              </Button>
              <Button variant="outline" onClick={() => setSeoOpen(true)}>
                Static pages SEO
              </Button>
              <AddButton onClick={() => openEditor("new")} />
            </>
          }
        />
        <div className="mb-6 flex flex-wrap gap-2 empty:hidden">
          {debouncedQuery && (
            <ActiveFilter
              content={<>Query: {debouncedQuery}</>}
              onClear={clearQuery}
            />
          )}
          {status && (
            <ActiveFilter
              content={
                <>Status: {status === "published" ? "Published" : "Draft"}</>
              }
              onClear={clearStatus}
            />
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
          getRowKey={({ id }) => id}
          emptyState={getTableEmptyState({
            entity: "article",
            isFiltered: !!debouncedQuery || !!status,
            hasQuery: !!debouncedQuery && !status,
            onClear: clearFilters,
            onAdd: () => openEditor("new"),
          })}
        />

        <TableModals
          action={action}
          onClose={clearAction}
          config={{
            publish: {
              title: "Publish article?",
              onConfirm: async (action) => {
                await handlePublishArticle(action.id);
                await refetch();
              },
            },
            unpublish: {
              title: "Unpublish article?",
              onConfirm: async (action) => {
                await handleUnpublishArticle(action.id);
                await refetch();
              },
            },
            delete: {
              title: "Delete article?",
              description: "This action cannot be undone.",
              onConfirm: async (action) => {
                await handleDeleteArticle(action.id);
                await refetch();
              },
            },
          }}
        />

        <Dialog open={isHomeSectionsOpen} onOpenChange={setHomeSectionsOpen}>
          <DialogContent className="max-h-[calc(100%-4rem)] overflow-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Home Sections</DialogTitle>
            </DialogHeader>
            <HomeSectionsEditor inModal />
          </DialogContent>
        </Dialog>

        <Dialog open={isSeoOpen} onOpenChange={setSeoOpen}>
          <DialogContent className="max-h-[calc(100%-4rem)] overflow-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Static Pages SEO</DialogTitle>
            </DialogHeader>
            <SeoContent />
          </DialogContent>
        </Dialog>
      </div>
    </ErrorCatcher>
  );
};
