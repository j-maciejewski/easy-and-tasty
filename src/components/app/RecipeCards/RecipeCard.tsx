import Link from "next/link";

import { getImageTransitionName } from "@/lib/utils";

import { RetryImage } from "../RetryImage";
import { SharedImage, SharedImageScope } from "../SharedImage";
import { RecipeMeta } from "./RecipeMeta";

interface RecipeCardProps {
  recipe: Omit<Recipe, "content" | "createdAt" | "updatedAt" | "publishedAt"> &
    RecipeRatingOptions;
}
export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <SharedImageScope>
      <Link
        href={`/recipe/${recipe.slug}`}
        className="group block rounded-2xl outline-offset-4"
      >
        <SharedImage name={getImageTransitionName(`recipe/${recipe.slug}`)}>
          <div className="bg-muted aspect-4/3 overflow-hidden rounded-2xl">
            <RetryImage
              src={recipe.image}
              width={480}
              height={360}
              alt={recipe.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          </div>
        </SharedImage>
        <h3 className="font-display decoration-primary mt-3 line-clamp-2 text-lg leading-snug font-semibold decoration-2 underline-offset-4 group-hover:underline">
          {recipe.title}
        </h3>
        <RecipeMeta recipe={recipe} className="mt-1.5" />
      </Link>
    </SharedImageScope>
  );
};
