"use client";

import { use, useEffect, useMemo } from "react";

import { CuisineForm, DataTable } from "@/components/dashboard";
import { CuisinesContext, PaginationContext } from "@/context";
import {
  matchesStatus,
  searchItems,
  sortItems,
  useColumnsToggler,
  useCuisinesActions,
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

export const CuisinesTable = () => {
  const { query, setQuery, debouncedQuery, clearQuery } =
    useDebouncedSearchQuery();
  const { status, setStatus, clearStatus } = useStatusFilter();
  const { sort, pagination, setTotalItemsCount, handleChangePage } =
    use(PaginationContext)!;
  const { cuisines, cuisinesLoading, refreshCuisines } = use(CuisinesContext)!;

  const { action, setAction, clearAction } = useModalAction<ModalAction>();

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
    "cuisines",
  );

  const clearFilters = () => {
    clearQuery();
    clearStatus();
  };

  const filteredCuisines = useMemo(() => {
    if (!cuisines) return [];

    const filteredCuisines = searchItems(
      [...cuisines.values()].filter(({ publishedAt }) =>
        matchesStatus(publishedAt, status),
      ),
      ["name", "slug", "description"],
      debouncedQuery,
    );

    sortItems(filteredCuisines, sort.key as keyof Cuisine, sort.order);

    return filteredCuisines;
  }, [debouncedQuery, status, cuisines, sort.key, sort.order]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (cuisinesLoading) return;

    setTotalItemsCount(filteredCuisines.length);

    if (
      pagination.currentPage > 1 &&
      (pagination.currentPage - 1) * pagination.itemsPerPage >=
        filteredCuisines.length
    )
      handleChangePage(1);
  }, [filteredCuisines.length, cuisinesLoading]);

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
        isLoading={cuisinesLoading}
        hiddenColumns={hiddenColumns}
        columns={columns}
        data={filteredCuisines.slice(
          (pagination.currentPage - 1) * pagination.itemsPerPage,
          pagination.currentPage * pagination.itemsPerPage,
        )}
        getRowKey={({ id }) => id}
        emptyState={getTableEmptyState({
          entity: "cuisine",
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
