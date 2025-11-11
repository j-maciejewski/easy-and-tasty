import { Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardHeader, Separator } from "@/components/ui";

import { Rating } from "../Rating";

interface RecipesListItemProps {
  recipe: Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
    RecipeRatingOptions;
}

export const RecipeListItem = ({ recipe }: RecipesListItemProps) => {
  return (
    <Link key={recipe.id} href={`/recipe/${recipe.slug}`}>
      <Card className="card py-0 transition-colors duration-200 hover:bg-gray-100">
        <div className="flex items-center gap-2 rounded-lg">
          <Image
            src={recipe.image}
            width={80}
            height={80}
            alt={recipe.title}
            loading="lazy"
            className="size-20 min-w-20 rounded-l-lg object-cover"
          />
          <CardHeader className="grow p-2 text-sm">
            <h6 className="font-medium">{recipe.title}</h6>
            <div className="mt-2 flex gap-2 text-gray-600 text-sm">
              <Rating rating={recipe.avgRating} />
              {recipe.ratingsCount !== 0 && (
                <>
                  <Separator
                    orientation="vertical"
                    className="h-auto bg-gray-500/90"
                  />
                  <p className="whitespace-nowrap">
                    {recipe.ratingsCount} Ratings
                  </p>
                </>
              )}
              <div className="flex items-center">
                <Timer className="mr-1 size-4" />
                <span className="whitespace-nowrap">{recipe.time} minutes</span>
              </div>
            </div>
          </CardHeader>
        </div>
      </Card>
    </Link>
  );
};
