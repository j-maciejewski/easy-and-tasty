"use client";

import { use, useEffect } from "react";

import { DataTable, ErrorCatcher, RecipeForm } from "@/components/dashboard";
import { Badge } from "@/components/ui";
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

export const RecipesTable = () => {
  const { categories, categoriesLoading } = use(CategoriesContext)!;
  const { cuisines, cuisinesLoading } = use(CuisinesContext)!;

  const { pagination, sort, handleChangePage, setTotalItemsCount } =
    use(PaginationContext)!;
  const { query, setQuery, debouncedQuery, clearQuery } =
    useDebouncedSearchQuery(() => handleChangePage(1));

  const { action, setAction, clearAction } = useModalAction<ModalAction>();

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
  });

  const { handlePublishRecipe, handleUnpublishRecipe, handleDeleteRecipe } =
    useRecipesActions();

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!recipes?.pagination) return;

    setTotalItemsCount(recipes.pagination.hitsCount);
  }, [recipes]);

  type RecipeItem = NonNullable<typeof recipes>["results"][number];

  const columns: TableColumn<RecipeItem>[] = [
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
        <div className="inline-flex gap-2">
          {categoryIds.map((id) => (
            <Badge key={id} className="border-rose-700 bg-rose-700 text-white">
              {categories?.get(id)?.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      label: "Cuisines",
      render: ({ cuisineIds }) => (
        <div className="inline-flex gap-2">
          {cuisineIds.map((id) => (
            <Badge key={id} className="border-cyan-700 bg-cyan-700 text-white">
              {cuisines?.get(id)?.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      label: "Rating",
      sortKey: "avg_rating",
      render: ({ avgRating }) => avgRating,
    },
    {
      label: "Comments",
      render: ({ commentsCount }) => commentsCount,
      sortKey: "comments_count",
    },
    {
      label: "Bookmarks",
      render: ({ bookmarksCount }) => bookmarksCount,
      sortKey: "bookmarks_count",
    },
    {
      label: "Votes",
      render: ({ ratingsCount }) => ratingsCount,
      sortKey: "ratings_count",
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
              onClick: () => setAction({ type: "edit", id }),
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
  );

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
          {debouncedQuery && (
            <ActiveFilter
              content={<>Query: {debouncedQuery}</>}
              onClear={clearQuery}
            />
          )}
        </div>

        <DataTable
          isLoading={recipesLoading || cuisinesLoading || categoriesLoading}
          hiddenColumns={hiddenColumns}
          columns={columns}
          data={recipes?.results ?? []}
        />

        <TableModals
          action={action}
          onClose={clearAction}
          config={{
            form: {
              addTitle: "New recipe",
              editTitle: "Edit recipe",
              form: RecipeForm,
              getFormProps: (action) => ({ recipeId: action.id }),
            },
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
