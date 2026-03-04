"use client";

import { redirect } from "next/navigation";
import { use, useEffect, useMemo } from "react";

import { CategoryForm, DataTable } from "@/components/dashboard";
import { Path } from "@/config";
import { CategoriesContext, PaginationContext } from "@/context";
import {
  searchItems,
  sortItems,
  useCategoriesActions,
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

export const CategoriesTable = () => {
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

  const { action, setAction, clearAction } = useModalAction<ModalAction>();

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
      <TableToolbar
        search={
          <SearchBar
            placeholder="Search categories..."
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
        isLoading={categoriesLoading}
        hiddenColumns={hiddenColumns}
        columns={columns}
        data={filteredCategories.slice(
          (pagination.currentPage - 1) * pagination.itemsPerPage,
          pagination.currentPage * pagination.itemsPerPage,
        )}
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
