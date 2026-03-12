import Image from "next/image";
import Link from "next/link";

import { Card, CardHeader } from "@/components/ui";

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
            <h6 className="font-medium text-sm">{recipe.title}</h6>
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
          </CardHeader>
        </div>
      </Card>
    </Link>
  );
};
