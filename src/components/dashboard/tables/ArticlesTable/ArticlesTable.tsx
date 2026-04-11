"use client";

import { redirect } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";

import {
  DataTable,
  ErrorCatcher,
  HomeSectionsEditor,
  PageForm,
  SeoContent,
} from "@/components/dashboard";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Path } from "@/config";
import { PaginationContext } from "@/context";
import { api } from "@/trpc/react";
import {
  searchItems,
  sortItems,
  useArticlesActions,
  useColumnsToggler,
  useModalAction,
  useSearchQuery,
} from "@/utils";

import {
  ActiveFilter,
  AddButton,
  ColumnsToggler,
  DateCell,
  ModalAction,
  SearchBar,
  SlugCell,
  StatusBadge,
  TableColumn,
  TableDropdownActions,
  TableModals,
  TableToolbar,
} from "../shared";

export const ArticlesTable = () => {
  const [isHomeSectionsOpen, setHomeSectionsOpen] = useState(false);
  const [isSeoOpen, setSeoOpen] = useState(false);
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
  } = api.authorized.article.getArticles.useQuery();

  const { action, setAction, clearAction } = useModalAction<ModalAction>();

  const { handleDeleteArticle, handlePublishArticle, handleUnpublishArticle } =
    useArticlesActions();

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!pages) return;

    if ((pagination.currentPage - 1) * pagination.itemsPerPage > pages.length)
      redirect(Path.DASHBOARD_ARTICLES);

    setTotalItemsCount(pages.length);
  }, [pages]);

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
              onClick: () => setAction({ type: "edit", id: page.id }),
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
      <div>
        <TableToolbar
          search={
            <SearchBar
              placeholder="Search articles..."
              value={query}
              onChange={setQuery}
            />
          }
          actions={
            <>
              <ColumnsToggler
                columnNames={columns.map(({ label }) => label)}
                hiddenColumns={hiddenColumns}
                toggleColumn={toggleColumn}
              />
              <Button onClick={() => setHomeSectionsOpen(true)}>
                Home sections
              </Button>
              <Button onClick={() => setSeoOpen(true)}>Static pages SEO</Button>
              <AddButton onClick={() => setAction({ type: "add" })} />
            </>
          }
        />
        <div className="mb-6 empty:hidden">
          {query && (
            <ActiveFilter content={<>Query: {query}</>} onClear={clearQuery} />
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

        <TableModals
          action={action}
          onClose={clearAction}
          config={{
            form: {
              addTitle: "New article",
              editTitle: "Edit article",
              modalClassName:
                "max-h-[calc(100%-4rem)] overflow-auto sm:max-w-5xl",
              form: PageForm,
              getFormProps: (action) => ({ pageId: action.id }),
            },
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
