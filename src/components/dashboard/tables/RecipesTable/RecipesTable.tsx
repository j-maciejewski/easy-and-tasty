"use client";

import { Eye, EyeOff, Globe, ImageOff, Tag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

import { DataTable, ErrorCatcher } from "@/components/dashboard";
import { getDashboardRecipePath } from "@/config";
import {
  CategoriesContext,
  CuisinesContext,
  PaginationContext,
} from "@/context";
import { api } from "@/trpc/react";
import {
  useColumnsToggler,
  useDebouncedSearchQuery,
  useModalAction,
  useRecipesActions,
  useRowSelection,
  useStatusFilter,
  useWithReturnTo,
} from "@/utils";

import {
  ActiveFilter,
  AddButton,
  BadgeList,
  BulkActionsBar,
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

export const RecipesTable = () => {
  const { categories, categoriesLoading } = use(CategoriesContext)!;
  const { cuisines, cuisinesLoading } = use(CuisinesContext)!;

  const { pagination, sort, setTotalItemsCount } = use(PaginationContext)!;
  const { query, setQuery, debouncedQuery, clearQuery } =
    useDebouncedSearchQuery();
  const { status, setStatus, clearStatus } = useStatusFilter();

  const { action, setAction, clearAction } = useModalAction<ModalAction>();
  const router = useRouter();
  const withReturnTo = useWithReturnTo();
  const openEditor = (id: number | "new") =>
    router.push(withReturnTo(getDashboardRecipePath(id)));
  const duplicateRecipe = (id: number) =>
    router.push(
      `${withReturnTo(getDashboardRecipePath("new"))}&duplicate=${id}`,
    );

  const { selectedKeys, setSelectedKeys, clearSelection } = useRowSelection([
    pagination.currentPage,
    pagination.itemsPerPage,
    sort.key,
    sort.order,
    debouncedQuery,
    status,
  ]);

  const {
    data: recipes,
    isLoading: recipesLoading,
    error: recipesError,
    refetch: refetchRecipes,
  } = api.authorized.recipe.getRecipes.useQuery({
    title: debouncedQuery,
    orderBy: sort.key ?? "createdAt",
    orderDir: sort.order,
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
    status,
  });

  const {
    handlePublishRecipe,
    handleUnpublishRecipe,
    handleDeleteRecipe,
    handleBulkSetPublishedRecipes,
    handleBulkDeleteRecipes,
    handleBulkAddCategory,
    handleBulkAddCuisine,
  } = useRecipesActions();

  const onBulkSuccess = () => {
    clearSelection();
    refetchRecipes();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!recipes) return;

    setTotalItemsCount(recipes.pagination?.hitsCount ?? 0);
  }, [recipes]);

  type RecipeItem = NonNullable<typeof recipes>["results"][number];

  const columns: TableColumn<RecipeItem>[] = [
    {
      label: "Image",
      render: ({ image, title }) =>
        image ? (
          // biome-ignore lint/performance/noImgElement: explanation
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="bg-muted size-10 rounded-md border object-cover"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-md border">
            <ImageOff className="size-4" />
          </div>
        ),
    },
    {
      label: "Title",
      sortKey: "title",
      render: ({ title }) => title,
    },
    {
      label: "Slug",
      sortKey: "slug",
      render: ({ slug }) => <SlugCell slug={slug} />,
    },
    {
      label: "Categories",
      render: ({ categoryIds }) => (
        <BadgeList
          items={categoryIds.map((id) => ({
            id,
            label: categories?.get(id)?.name,
          }))}
          badgeClassName="border-primary/25 bg-primary/10 text-primary"
        />
      ),
    },
    {
      label: "Cuisines",
      render: ({ cuisineIds }) => (
        <BadgeList
          items={cuisineIds.map((id) => ({
            id,
            label: cuisines?.get(id)?.name,
          }))}
          badgeClassName="border-border bg-secondary text-secondary-foreground"
        />
      ),
    },
    {
      label: "Rating",
      sortKey: "avg_rating",
      align: "right",
      render: ({ avgRating }) => avgRating,
    },
    {
      label: "Comments",
      render: ({ commentsCount }) => commentsCount,
      sortKey: "comments_count",
      align: "right",
    },
    {
      label: "Bookmarks",
      render: ({ bookmarksCount }) => bookmarksCount,
      sortKey: "bookmarks_count",
      align: "right",
    },
    {
      label: "Votes",
      render: ({ ratingsCount }) => ratingsCount,
      sortKey: "ratings_count",
      align: "right",
    },
    {
      label: "Status",
      render: ({ publishedAt }) => <StatusBadge isPublished={!!publishedAt} />,
    },
    {
      label: "Created At",
      render: ({ createdAt }) => <DateCell date={createdAt} />,
      defaultHidden: true,
    },
    {
      label: "Updated At",
      render: ({ updatedAt }) => <DateCell date={updatedAt} />,
      defaultHidden: true,
    },
    {
      label: "Published At",
      render: ({ publishedAt }) => <DateCell date={publishedAt} />,
      defaultHidden: true,
    },
    {
      label: "Actions",
      render: ({ id, publishedAt }) => (
        <TableDropdownActions
          actions={[
            {
              label: "Edit Recipe",
              onClick: () => openEditor(id),
            },
            {
              label: "Duplicate Recipe",
              onClick: () => duplicateRecipe(id),
            },
            publishedAt
              ? {
                  label: "Unpublish Recipe",
                  onClick: () => setAction({ type: "unpublish", id }),
                }
              : {
                  label: "Publish Recipe",
                  onClick: () => setAction({ type: "publish", id }),
                },
            {
              label: "Delete Recipe",
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
    "recipes",
  );

  const clearFilters = () => {
    clearQuery();
    clearStatus();
  };

  return (
    <ErrorCatcher errors={[recipesError] as (Error | null)[]}>
      <div>
        <TableToolbar
          search={
            <SearchBar
              placeholder="Search recipes..."
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
          isLoading={recipesLoading || cuisinesLoading || categoriesLoading}
          hiddenColumns={hiddenColumns}
          columns={columns}
          data={recipes?.results ?? []}
          getRowKey={({ id }) => id}
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          emptyState={getTableEmptyState({
            entity: "recipe",
            isFiltered: !!debouncedQuery || !!status,
            hasQuery: !!debouncedQuery && !status,
            onClear: clearFilters,
            onAdd: () => openEditor("new"),
          })}
        />

        <BulkActionsBar
          count={selectedKeys.length}
          onClear={clearSelection}
          actions={[
            {
              label: "Publish",
              icon: Eye,
              onClick: () =>
                handleBulkSetPublishedRecipes(
                  selectedKeys,
                  true,
                  onBulkSuccess,
                ),
            },
            {
              label: "Unpublish",
              icon: EyeOff,
              onClick: () =>
                handleBulkSetPublishedRecipes(
                  selectedKeys,
                  false,
                  onBulkSuccess,
                ),
            },
            {
              label: "Assign category",
              icon: Tag,
              options: [...(categories?.values() ?? [])].map(
                ({ id, name }) => ({ value: id, label: name }),
              ),
              onSelect: (categoryId) =>
                handleBulkAddCategory(selectedKeys, categoryId, onBulkSuccess),
            },
            {
              label: "Assign cuisine",
              icon: Globe,
              options: [...(cuisines?.values() ?? [])].map(({ id, name }) => ({
                value: id,
                label: name,
              })),
              onSelect: (cuisineId) =>
                handleBulkAddCuisine(selectedKeys, cuisineId, onBulkSuccess),
            },
            {
              label: "Delete",
              icon: Trash2,
              variant: "destructive",
              confirm: {
                title: `Delete ${selectedKeys.length} ${selectedKeys.length === 1 ? "recipe" : "recipes"}?`,
                description: "This action cannot be undone.",
              },
              onClick: () =>
                handleBulkDeleteRecipes(selectedKeys, onBulkSuccess),
            },
          ]}
        />

        <TableModals
          action={action}
          onClose={clearAction}
          config={{
            publish: {
              title: "Publish recipe?",
              onConfirm: async (action) => {
                await handlePublishRecipe(action.id, refetchRecipes);
              },
            },
            unpublish: {
              title: "Unpublish recipe?",
              onConfirm: async (action) => {
                await handleUnpublishRecipe(action.id, refetchRecipes);
              },
            },
            delete: {
              title: "Delete recipe?",
              description: "This action cannot be undone.",
              onConfirm: async (action) => {
                await handleDeleteRecipe(action.id, refetchRecipes);
              },
            },
          }}
        />
      </div>
    </ErrorCatcher>
  );
};
