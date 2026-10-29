import Link from "next/link";

import { RetryImage } from "../RetryImage";
import { RecipeMeta } from "./RecipeMeta";

interface RecipesListItemProps {
  recipe: Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
    RecipeRatingOptions;
}

export const RecipeListItem = ({ recipe }: RecipesListItemProps) => {
  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-card"
    >
      <RetryImage
        src={recipe.image}
        width={96}
        height={96}
        alt={recipe.title}
        loading="lazy"
        className="size-20 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0">
        <h3 className="line-clamp-2 font-display font-semibold text-base leading-snug group-hover:text-primary">
          {recipe.title}
        </h3>
        <RecipeMeta recipe={recipe} className="mt-1 text-xs" />
      </div>
    </Link>
  );
};
