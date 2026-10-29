import Link from "next/link";

import { RetryImage } from "../RetryImage";
import { RecipeMeta } from "./RecipeMeta";

interface RecipeCardProps {
  recipe: Omit<Recipe, "content" | "createdAt" | "updatedAt" | "publishedAt"> &
    RecipeRatingOptions;
}
export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className="group block rounded-2xl outline-offset-4"
    >
      <div className="aspect-4/3 overflow-hidden rounded-2xl bg-muted">
        <RetryImage
          src={recipe.image}
          width={480}
          height={360}
          alt={recipe.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
        />
      </div>
      <h3 className="mt-3 line-clamp-2 font-display font-semibold text-lg leading-snug decoration-2 decoration-primary underline-offset-4 group-hover:underline">
        {recipe.title}
      </h3>
      <RecipeMeta recipe={recipe} className="mt-1.5" />
    </Link>
  );
};
