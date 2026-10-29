import Link from "next/link";

import { getImageTransitionName } from "@/lib/utils";

import { RetryImage } from "../RetryImage";
import { SharedImage, SharedImageScope } from "../SharedImage";
import { RecipeMeta } from "./RecipeMeta";

interface RecipesListItemProps {
  recipe: Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
    RecipeRatingOptions;
}

export const RecipeListItem = ({ recipe }: RecipesListItemProps) => {
  return (
    <SharedImageScope>
      <Link
        href={`/recipe/${recipe.slug}`}
        className="group hover:bg-card flex items-center gap-3 rounded-2xl p-2 transition-colors"
      >
        <SharedImage name={getImageTransitionName(`recipe/${recipe.slug}`)}>
          <RetryImage
            src={recipe.image}
            width={96}
            height={96}
            alt={recipe.title}
            loading="lazy"
            className="size-20 shrink-0 rounded-xl object-cover"
          />
        </SharedImage>
        <div className="min-w-0">
          <h3 className="font-display group-hover:text-primary line-clamp-2 text-base leading-snug font-semibold">
            {recipe.title}
          </h3>
          <RecipeMeta recipe={recipe} className="mt-1 text-xs" />
        </div>
      </Link>
    </SharedImageScope>
  );
};
