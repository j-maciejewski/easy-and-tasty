import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getRecipesByCategory, getRecipesByCuisine } from "@/lib/data";

import { RecipeCard } from "./RecipeCards/RecipeCard";
import { SectionHeading } from "./SectionHeading";

interface CategoryPreview {
  category: {
    name: string;
    slug: string;
    description?: string;
  };
}

interface CuisinePreview {
  cuisine: {
    name: string;
    slug: string;
    description?: string;
  };
}

type RecipesGroupPreviewProps = CategoryPreview | CuisinePreview;

export const RecipesGroupPreview = async (props: RecipesGroupPreviewProps) => {
  const { name, description, slug, type, href } = (() => {
    if ("cuisine" in props) {
      return {
        name: props.cuisine.name,
        description: props.cuisine.description,
        href: `/cuisines/${props.cuisine.slug}`,
        slug: props.cuisine.slug,
        type: "cuisine",
      };
    }

    return {
      name: props.category.name,
      description: props.category.description,
      href: `/categories/${props.category.slug}`,
      slug: props.category.slug,
      type: "category",
    };
  })();

  const recipes = await (type === "cuisine"
    ? getRecipesByCuisine(slug)
    : getRecipesByCategory(slug));

  if (!recipes.length) return null;

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-6">
        <SectionHeading
          heading={name}
          subheading={description}
          className="mb-0!"
        />
        <Link
          href={href}
          className="group hover:text-primary flex shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors"
        >
          View all
          <span className="sr-only"> {name} recipes</span>
          <ArrowRight className="size-4 stroke-[2px] transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
};
