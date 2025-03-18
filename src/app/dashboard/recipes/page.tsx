"use client";
import {
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DropdownMenuItem,
  Input,
} from "@/components/ui";
import { Path } from "@/config";
import { api } from "@/trpc/react";
import { createMap } from "@/utils";
import { Columns3, Plus, X } from "lucide-react";
import Link from "next/link";
import { ReactNode, use, useEffect, useMemo, useRef, useState } from "react";
import {
  ConditionalDialog,
  DataTable,
  DropdownActions,
  EditCategoryForm,
  ErrorCatcher,
  MultiSelect,
} from "../_components";
import { AddRecipeForm } from "../_components";
import { PaginationContext, UserContext } from "../_context";

export default function () {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = api.protected.category.getCategories.useQuery();
  const categories = useMemo(
    () => (categoriesData ? createMap(categoriesData) : null),
    [categoriesData],
  );
  const {
    data: cuisinesData,
    error: cuisinesError,
    isLoading: cuisinesLoading,
  } = api.protected.cuisine.getCuisines.useQuery();
  const cuisines = useMemo(
    () => (cuisinesData ? createMap(cuisinesData) : null),
    [cuisinesData],
  );
  const { pagination, handleChangePage, setTotalItemsCount } =
    use(PaginationContext)!;
  const { settings } = use(UserContext)!;
  const [editedRecipe, setEditedRecipe] = useState<number | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      handleChangePage(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const {
    data: recipes,
    isLoading: recipesLoading,
    error: recipesError,
  } = api.protected.recipe.getRecipes.useQuery({
    title: debouncedSearchTerm,
    orderBy: sortField,
    orderDir: sortDir,
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!recipes?.pagination) return;

    setTotalItemsCount(recipes.pagination.hitsCount);
  }, [recipes]);

  const columns: {
    label: string;
    render: (
      recipe: NonNullable<typeof recipes>["results"][number],
    ) => ReactNode;
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
      render: ({ slug }) => slug,
    },
    {
      label: "Categories",
      render: ({ categoryIds }) => (
        <div className="inline-flex gap-2">
          {categoryIds.map((id) => (
            <Badge key={id} variant="outline">
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
            <Badge key={id} variant="outline">
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
      render: () => "0",
    },
    {
      label: "Votes",
      render: ({ ratingsCount }) => ratingsCount,
      sortKey: "ratings_count",
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
      label: "Actions",
      render: ({ id }) => (
        <DropdownActions>
          <DropdownMenuItem>
            {settings.formsInModals ? (
              <button type="button" onClick={() => setEditedRecipe(id)}>
                Edit Category
              </button>
            ) : (
              <Link href={`${Path.DASHBOARD_RECIPES}/edit/${id}`}>
                Edit Category
              </Link>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            Delete Category
          </DropdownMenuItem>
        </DropdownActions>
      ),
    },
  ];

  const [hiddenColumns, setHiddenColumns] = useState([
    "Votes",
    "Created At",
    "Updated At",
  ]);

  const toggleColumn = (toggledColumn: string) => {
    setHiddenColumns((prev) => {
      if (prev.includes(toggledColumn)) {
        return prev.filter((column) => column !== toggledColumn);
      }
      return [...prev, toggledColumn];
    });
  };

  const addRecipeDialogCloseRef = useRef<HTMLButtonElement>(null);

  return (
    <ErrorCatcher
      errors={
        [cuisinesError, categoriesError, recipesError] as (Error | null)[]
      }
    >
      <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 w-full md:mb-0 md:w-1/3">
          <Input
            type="search"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <MultiSelect
            options={columns.map(({ label }) => ({
              label: label,
              value: label,
              checked: !hiddenColumns.includes(label),
            }))}
            toggleOption={toggleColumn}
          >
            <Button
              variant="outline"
              className="relative aspect-square text-foreground"
            >
              <Columns3 className="absolute size-5" />
            </Button>
          </MultiSelect>
          <ConditionalDialog
            title="Add recipe"
            trigger={
              <Button
                className="relative aspect-square"
                variant="secondary"
                disabled={
                  settings.formsInModals &&
                  (cuisinesLoading || categoriesLoading)
                }
              >
                <Plus className="absolute size-5 stroke-2 text-foreground" />
              </Button>
            }
            dialogRef={addRecipeDialogCloseRef}
            showDialog={settings.formsInModals}
            content={
              <AddRecipeForm
                categories={categoriesData!}
                cuisines={cuisinesData!}
                onSubmit={() => addRecipeDialogCloseRef.current?.click()}
              />
            }
            link={Path.DASHBOARD_NEW_RECIPE}
          />
        </div>
      </div>
      <div className="mb-6 empty:hidden">
        {debouncedSearchTerm && (
          <Badge
            variant="outline"
            className="cursor-pointer"
            tabIndex={0}
            onClick={clearSearch}
          >
            Query: {debouncedSearchTerm} <X className="h-4 text-red-600" />
          </Badge>
        )}
      </div>

      <DataTable
        isLoading={recipesLoading || cuisinesLoading || categoriesLoading}
        hiddenColumns={hiddenColumns}
        columns={columns}
        data={recipes?.results ?? []}
        sortDir={sortDir}
        sortField={sortField}
        setSortDir={setSortDir}
        setSortField={setSortField}
      />

      <Dialog
        open={editedRecipe !== null}
        onOpenChange={() => setEditedRecipe(null)}
      >
        <DialogContent className="max-h-[calc(100%_-_4rem)] overflow-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Recipe</DialogTitle>
          </DialogHeader>
          <EditCategoryForm
            categoryId={editedRecipe!}
            onSubmit={() => setEditedRecipe(null)}
          />
          <DialogClose />
        </DialogContent>
      </Dialog>
    </ErrorCatcher>
  );
}
