"use client";

import { redirect } from "next/navigation";
import { use, useEffect, useMemo } from "react";

import { CuisineForm, DataTable } from "@/components/dashboard";
import { Path } from "@/config";
import { CuisinesContext, PaginationContext } from "@/context";
import {
  searchItems,
  sortItems,
  useColumnsToggler,
  useCuisinesActions,
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

export const CuisinesTable = () => {
  const { query, setQuery, clearQuery } = useSearchQuery();
  const {
    sort,
    pagination,
    setTotalItemsCount,
    handleChangePage,
    handleChangeLimit,
  } = use(PaginationContext)!;
  const { cuisines, cuisinesLoading, refreshCuisines } = use(CuisinesContext)!;

  const { action, setAction, clearAction } = useModalAction<ModalAction>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!cuisines) return;

    if ((pagination.currentPage - 1) * pagination.itemsPerPage > cuisines.size)
      redirect(Path.DASHBOARD_CUISINES);

    setTotalItemsCount(cuisines.size);
  }, [cuisines]);

  const { handleDeleteCuisine, handlePublishCuisine, handleUnpublishCuisine } =
    useCuisinesActions();

  const columns: TableColumn<Cuisine>[] = [
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
              label: "Edit Cuisine",
              onClick: () => setAction({ type: "edit", id }),
            },
            publishedAt
              ? {
                  label: "Unpublish Cuisine",
                  onClick: () => setAction({ type: "unpublish", id }),
                }
              : {
                  label: "Publish Cuisine",
                  onClick: () => setAction({ type: "publish", id }),
                },
            {
              label: "Delete Cuisine",
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
      <TableToolbar
        search={
          <SearchBar
            placeholder="Search cuisines..."
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
        isLoading={cuisinesLoading}
        hiddenColumns={hiddenColumns}
        columns={columns}
        data={filteredCuisines.slice(
          (pagination.currentPage - 1) * pagination.itemsPerPage,
          pagination.currentPage * pagination.itemsPerPage,
        )}
      />

      <TableModals
        action={action}
        onClose={clearAction}
        config={{
          form: {
            addTitle: "New cuisine",
            editTitle: "Edit cuisine",
            form: CuisineForm,
            getFormProps: (action) => ({ cuisineId: action.id }),
          },
          publish: {
            title: "Publish cuisine?",
            onConfirm: (action) => {
              handlePublishCuisine(action.id);
              refreshCuisines();
            },
          },
          unpublish: {
            title: "Unpublish cuisine?",
            onConfirm: (action) => {
              handleUnpublishCuisine(action.id);
              refreshCuisines();
            },
          },
          delete: {
            title: "Delete cuisine?",
            description: "This action cannot be undone.",
            onConfirm: (action) => {
              handleDeleteCuisine(action.id);
              refreshCuisines();
            },
          },
        }}
      />
    </div>
  );
};
