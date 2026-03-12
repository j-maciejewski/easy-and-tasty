import { Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Rating } from "../Rating";

interface RecipeCardProps {
  recipe: Omit<Recipe, "content" | "createdAt" | "updatedAt" | "publishedAt"> &
    RecipeRatingOptions;
}
export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Link href={`/recipe/${recipe.slug}`}>
      <div className="card m-px overflow-hidden transition-colors duration-200 hover:bg-gray-100">
        <div className="w-full">
          <Image
            src={recipe.image}
            width={400}
            height={300}
            alt={recipe.title}
            loading="lazy"
            className="max-h-75 min-h-75 w-full object-cover"
          />
        </div>
        <div className="flex grow flex-col items-start justify-center p-3 text-center max-md:bottom-0 max-md:w-full max-md:px-4">
          <h3 className="mb-2 font-medium text-base text-foreground tracking-wide max-md:mb-2">
            {recipe.title}
          </h3>
          <div className="flex justify-center gap-2 text-gray-600 text-sm">
            <div className="flex gap-2">
              <Rating rating={recipe.avgRating} />
              {recipe.ratingsCount !== 0 && (
                <>
                  <div className="h-4 w-px bg-gray-400" />
                  <p className="whitespace-nowrap">
                    {recipe.ratingsCount} Ratings
                  </p>
                </>
              )}
            </div>
            <div className="h-4 w-px bg-gray-400" />
            <div className="flex items-center">
              <Timer className="mr-1 size-4" />
              <span className="whitespace-nowrap">{recipe.time} minutes</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
