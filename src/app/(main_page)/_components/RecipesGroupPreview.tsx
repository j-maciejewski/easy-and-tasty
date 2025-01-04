import { api } from "@/trpc/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { RecipeCard } from "./RecipeCard";

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

namespace RecipesGroupPreview {
  export type Props = CategoryPreview | CuisinePreview;
}

export const RecipesGroupPreview = async (props: RecipesGroupPreview.Props) => {
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
    ? api.public.recipe.getRecipesByCuisine({ slug, limit: 6 })
    : api.public.recipe.getRecipesByCategory({ slug, limit: 6 }));

  return (
    <div className="flex flex-col">
      <div className="~mb-4/6 flex items-center justify-between">
        <Link
          href={href}
          className="mx-auto flex items-center justify-center border-primary border-b-2 px-1 font-semibold hover:text-primary/90"
        >
          <h3 className="~text-xl/3xl">{name}</h3>
          <ArrowRight className="~/lg:~size-4/8 ml-2 stroke-[2px]" />
        </Link>
      </div>
      <div className="max-lg:-mb-2 ~gap-4/6 grid max-lg:overflow-auto max-lg:pb-2 md:grid-cols-[repeat(3,_1fr)]">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};
