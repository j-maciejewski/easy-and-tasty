"use client";

import { Columns3, Plus, X } from "lucide-react";
import { ReactNode, use, useEffect, useState } from "react";

import {
  AddRecipeForm,
  DataTable,
  DropdownActions,
  EditRecipeForm,
  ErrorCatcher,
  GenericConfirmModal,
  GenericModal,
  MultiSelect,
} from "@/components/dashboard";
import { Badge, Button, DropdownMenuItem, Input } from "@/components/ui";
import {
  CategoriesContext,
  CuisinesContext,
  PaginationContext,
} from "@/context";
import { api } from "@/trpc/react";
import { useDebouncedSearchQuery, useRecipesActions } from "@/utils";

export default function () {
  const { categories, categoriesLoading } = use(CategoriesContext)!;
  const { cuisines, cuisinesLoading } = use(CuisinesContext)!;

  const { pagination, handleChangePage, setTotalItemsCount } =
    use(PaginationContext)!;
  const { query, setQuery, debouncedQuery, clearQuery } =
    useDebouncedSearchQuery(() => handleChangePage(1));

  const [action, setAction] = useState<
    | {
        type: "publish" | "unpublish" | "delete" | "edit";
        recipeId: number;
      }
    | { type: "add" }
    | null
  >(null);

  const clearAction = () => setAction(null);

  const {
    data: recipes,
    isLoading: recipesLoading,
    error: recipesError,
    refetch: refetchRecipes,
  } = api.authorized.recipe.getRecipes.useQuery({
    title: debouncedQuery,
    orderBy: "createdAt",
    orderDir: "desc",
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

  const columns: {
    label: string;
    render: (recipe: RecipeItem) => ReactNode;
    sortKey?: string;
  }[] = [
    {
      label: "Title",
      sortKey: "title",
      render: ({ title }) => title,
    },
    {
      label: "Slug",
      sortKey: "slug",
      render: ({ slug }) => (
        <span className="text-muted-foreground">{slug}</span>
      ),
    },
    {
      label: "Categories",
      render: ({ categoryIds }) => (
        <div className="inline-flex gap-2">
          {categoryIds.map((id) => (
            <Badge key={id}>{categories?.get(id)?.name}</Badge>
          ))}
        </div>
      ),
    },
    {
      label: "Cuisines",
      render: ({ cuisineIds }) => (
        <div className="inline-flex gap-2">
          {cuisineIds.map((id) => (
            <Badge key={id}>{cuisines?.get(id)?.name}</Badge>
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
      render: () => "0",
    },
    {
      label: "Votes",
      render: ({ ratingsCount }) => ratingsCount,
      sortKey: "ratings_count",
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
      label: "Created At",
      render: ({ createdAt }) => new Date(createdAt).toLocaleString(),
    },
    {
      label: "Updated At",
      render: ({ updatedAt }) =>
        updatedAt ? new Date(updatedAt).toLocaleString() : null,
    },
    {
      label: "Published At",
      render: ({ publishedAt }) =>
        publishedAt ? new Date(publishedAt).toLocaleString() : null,
    },
    {
      label: "Actions",
      render: ({ id, publishedAt }) => (
        <DropdownActions>
          <DropdownMenuItem
            onClick={() => setAction({ type: "edit", recipeId: id })}
          >
            Edit Recipe
          </DropdownMenuItem>
          {publishedAt ? (
            <DropdownMenuItem
              onClick={() => setAction({ type: "unpublish", recipeId: id })}
            >
              Unpublish Recipe
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setAction({ type: "publish", recipeId: id })}
            >
              Publish Recipe
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setAction({ type: "delete", recipeId: id })}
          >
            Delete Recipe
          </DropdownMenuItem>
        </DropdownActions>
      ),
    },
  ];

  const [hiddenColumns, setHiddenColumns] = useState([
    "Votes",
    "Created At",
    "Updated At",
    "Published At",
  ]);

  const toggleColumn = (toggledColumn: string) => {
    setHiddenColumns((prev) => {
      if (prev.includes(toggledColumn)) {
        return prev.filter((column) => column !== toggledColumn);
      }
      return [...prev, toggledColumn];
    });
  };

  return (
    <ErrorCatcher
      errors={
        [/*cuisinesError, categoriesError, */ recipesError] as (Error | null)[]
      }
    >
      <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 w-full md:mb-0 md:w-1/3">
          <Input
            type="search"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <MultiSelect
            options={columns.map(({ label }) => ({
              label,
              value: label,
              checked: !hiddenColumns.includes(label),
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
        {debouncedQuery && (
          <Badge
            variant="outline"
            className="cursor-pointer"
            tabIndex={0}
            onClick={clearQuery}
          >
            Query: {debouncedQuery} <X className="h-4 text-red-600" />
          </Badge>
        )}
      </div>

      <DataTable
        isLoading={recipesLoading || cuisinesLoading || categoriesLoading}
        hiddenColumns={hiddenColumns}
        columns={columns}
        data={recipes?.results ?? []}
      />

      {action?.type === "add" && (
        <GenericModal
          title="New recipe"
          open={action?.type === "add"}
          handleClose={clearAction}
          content={
            <AddRecipeForm
              onSubmit={async () => {
                clearAction();
                await refetchRecipes();
              }}
            />
          }
        />
      )}

      {action?.type === "edit" && (
        <GenericModal
          title="Edit recipe"
          open={action?.type === "edit"}
          handleClose={clearAction}
          content={
            <EditRecipeForm
              recipeId={action?.recipeId}
              onSubmit={async () => {
                clearAction();
                await refetchRecipes();
              }}
            />
          }
        />
      )}

      {action?.type === "publish" && (
        <GenericConfirmModal
          title="Publish recipe?"
          open={action?.type === "publish"}
          handleClose={clearAction}
          handleConfirm={async () => {
            await handlePublishRecipe(action?.recipeId!, async () => {
              await refetchRecipes();
            });
            clearAction();
          }}
        />
      )}

      {action?.type === "unpublish" && (
        <GenericConfirmModal
          title="Unpublish recipe?"
          open={action?.type === "unpublish"}
          handleClose={clearAction}
          handleConfirm={async () => {
            await handleUnpublishRecipe(action?.recipeId!, async () => {
              await refetchRecipes();
            });
            clearAction();
          }}
        />
      )}

      {action?.type === "delete" && (
        <GenericConfirmModal
          title="Delete recipe?"
          open={action?.type === "delete"}
          description="This action cannot be undone."
          handleClose={clearAction}
          handleConfirm={async () => {
            await handleDeleteRecipe(action?.recipeId!, async () => {
              await refetchRecipes();
            });
            clearAction();
          }}
        />
      )}
    </ErrorCatcher>
  );
}
