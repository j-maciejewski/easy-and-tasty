import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getRecipesByCategory, getRecipesByCuisine } from "@/lib/data";

import { RecipeCard } from "./RecipeCards/RecipeCard";

interface CategoryPreview {
  category: {
    name: string;
    slug: string;
  };
}

interface CuisinePreview {
  cuisine: {
    name: string;
    slug: string;
  };
}

type RecipesGroupPreviewProps = CategoryPreview | CuisinePreview;

export const RecipesGroupPreview = async (props: RecipesGroupPreviewProps) => {
  const { name, slug, type, href } = (() => {
    if ("cuisine" in props) {
      return {
        name: props.cuisine.name,
        href: `/cuisines/${props.cuisine.slug}`,
        slug: props.cuisine.slug,
        type: "cuisine",
      };
    }

    return {
      name: props.category.name,
      href: `/categories/${props.category.slug}`,
      slug: props.category.slug,
      type: "category",
    };
  })();

  const recipes = await (type === "cuisine"
    ? getRecipesByCuisine(slug)
    : getRecipesByCategory(slug));

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={href}
          className="relative mx-auto flex items-center justify-center font-semibold transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-primary/95 hover:after:w-full"
        >
          <h3 className="text-xl">{name}</h3>
          <ArrowRight className="ml-2 size-4 stroke-[2px]" />
        </Link>
      </div>
      <div className="max-lg:-mb-2 grid gap-4 max-lg:overflow-auto max-lg:pb-2 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};
