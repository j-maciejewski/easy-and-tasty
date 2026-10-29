import Link from "next/link";

import { Button } from "@/components/ui";
import { getImageTransitionName } from "@/lib/utils";

import { RetryImage } from "../RetryImage";
import { SharedImage, SharedImageScope } from "../SharedImage";
import { RecipeMeta } from "./RecipeMeta";

interface RecipeCardFullProps {
  recipe: Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
    RecipeRatingOptions;
}
export const RecipeCardFull = ({ recipe }: RecipeCardFullProps) => {
  return (
    <SharedImageScope>
      <div className="bg-card grid overflow-hidden rounded-3xl md:grid-cols-[3fr_2fr]">
        <Link
          href={`/recipe/${recipe.slug}`}
          tabIndex={-1}
          aria-hidden
          className="relative block aspect-4/3 overflow-hidden md:aspect-auto md:min-h-80"
        >
          <SharedImage name={getImageTransitionName(`recipe/${recipe.slug}`)}>
            <RetryImage
              src={recipe.image}
              width={800}
              height={560}
              alt={recipe.title}
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
          </SharedImage>
        </Link>
        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <h3 className="font-display text-2xl leading-tight font-semibold tracking-tight lg:text-4xl">
            {recipe.title}
          </h3>
          {recipe.description && (
            <p className="text-muted-foreground line-clamp-4 text-base">
              {recipe.description}
            </p>
          )}
          <RecipeMeta recipe={recipe} />
          <Button asChild size="lg" className="mt-2 w-fit rounded-full px-6">
            <Link href={`/recipe/${recipe.slug}`}>Get the recipe</Link>
          </Button>
        </div>
      </div>
    </SharedImageScope>
  );
};
