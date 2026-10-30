"use client";

import { use, useEffect, useMemo } from "react";

import { CategoryForm, DataTable } from "@/components/dashboard";
import { CategoriesContext, PaginationContext } from "@/context";
import {
  matchesStatus,
  searchItems,
  sortItems,
  useCategoriesActions,
  useColumnsToggler,
  useDebouncedSearchQuery,
  useModalAction,
  useStatusFilter,
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

export const CategoriesTable = () => {
  const { query, setQuery, debouncedQuery, clearQuery } =
    useDebouncedSearchQuery();
  const { status, setStatus, clearStatus } = useStatusFilter();
  const { sort, pagination, setTotalItemsCount, handleChangePage } =
    use(PaginationContext)!;
  const { categories, categoriesLoading, refreshCategories } =
    use(CategoriesContext)!;

  const { action, setAction, clearAction } = useModalAction<ModalAction>();

  const {
    handleDeleteCategory,
    handlePublishCategory,
    handleUnpublishCategory,
  } = useCategoriesActions();

  const columns: TableColumn<Category>[] = [
    {
      label: "Name",
      sortKey: "name",
      render: ({ name }) => name,
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
      label: "Published at",
      sortKey: "publishedAt",
      render: ({ publishedAt }) => <DateCell date={publishedAt} />,
      defaultHidden: true,
    },
    {
      label: "Actions",
      render: ({ id, publishedAt }) => (
        <TableDropdownActions
          actions={[
            {
              label: "Edit Category",
              onClick: () => setAction({ type: "edit", id }),
            },
            publishedAt
              ? {
                  label: "Unpublish Category",
                  onClick: () => setAction({ type: "unpublish", id }),
                }
              : {
                  label: "Publish Category",
                  onClick: () => setAction({ type: "publish", id }),
                },
            {
              label: "Delete Category",
              onClick: () => setAction({ type: "delete", id }),
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
    "categories",
  );

  const clearFilters = () => {
    clearQuery();
    clearStatus();
  };

  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    const filteredCategories = searchItems(
      [...categories.values()].filter(({ publishedAt }) =>
        matchesStatus(publishedAt, status),
      ),
      ["name", "slug", "description"],
      debouncedQuery,
    );

    sortItems(filteredCategories, sort.key as keyof Category, sort.order);

    return filteredCategories;
  }, [debouncedQuery, status, categories, sort.key, sort.order]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (categoriesLoading) return;

    setTotalItemsCount(filteredCategories.length);

    if (
      pagination.currentPage > 1 &&
      (pagination.currentPage - 1) * pagination.itemsPerPage >=
        filteredCategories.length
    )
      handleChangePage(1);
  }, [filteredCategories.length, categoriesLoading]);

  return (
    <div>
      <TableToolbar
        search={
          <SearchBar
            placeholder="Search categories..."
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
            <AddButton onClick={() => setAction({ type: "add" })} />
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
        isLoading={categoriesLoading}
        hiddenColumns={hiddenColumns}
        columns={columns}
        data={filteredCategories.slice(
          (pagination.currentPage - 1) * pagination.itemsPerPage,
          pagination.currentPage * pagination.itemsPerPage,
        )}
        getRowKey={({ id }) => id}
        emptyState={getTableEmptyState({
          entity: "category",
          entityPlural: "categories",
          isFiltered: !!debouncedQuery || !!status,
          hasQuery: !!debouncedQuery && !status,
          onClear: clearFilters,
          onAdd: () => setAction({ type: "add" }),
        })}
      />

      <TableModals
        action={action}
        onClose={clearAction}
        config={{
          form: {
            addTitle: "New category",
            editTitle: "Edit category",
            form: CategoryForm,
            getFormProps: (action) => ({ categoryId: action.id }),
          },
          publish: {
            title: "Publish category?",
            onConfirm: (action) => {
              handlePublishCategory(action.id);
              refreshCategories();
            },
          },
          unpublish: {
            title: "Unpublish category?",
            onConfirm: (action) => {
              handleUnpublishCategory(action.id);
              refreshCategories();
            },
          },
          delete: {
            title: "Delete category?",
            description: "This action cannot be undone.",
            onConfirm: (action) => {
              handleDeleteCategory(action.id);
              refreshCategories();
            },
          },
        }}
      />
    </div>
  );
};
