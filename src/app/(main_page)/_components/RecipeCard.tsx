import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import { Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, forwardRef } from "react";
import { recipeImageSrcParser } from "../_utils";
import { Rating } from "./Rating";

namespace RecipeCard {
  export interface Props {
    recipe: Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
      RecipeRatingOptions;
  }
}
export const RecipeCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & RecipeCard.Props
>(({ className, recipe, ...props }, ref) => {
  return (
    <Link href={`/recipe/${recipe.slug}`}>
      <Card
        className={clsx(
          "flex h-full w-full flex-col transition ease-in-out hover:opacity-80",
          className,
        )}
        ref={ref}
        {...props}
      >
        <CardContent className="p-0">
          <Image
            src={recipeImageSrcParser(recipe.image)}
            width={400}
            height={600}
            alt={recipe.title}
            loading="lazy"
            className="max-h-[300px] min-h-[300px] w-full rounded-t-lg object-cover"
          />
        </CardContent>
        <CardHeader className="grow justify-center p-4 pb-2">
          <CardTitle className="~text-base/lg items-start font-medium tracking-wide">
            {recipe.title}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex grow flex-col items-start justify-center p-4 pt-0 text-center">
          <div className="~text-sm/base flex gap-2 text-gray-600">
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
            <Separator
              orientation="vertical"
              className="h-auto bg-gray-500/90"
            />
            <div className="flex items-center">
              <Timer className="mr-1 size-4" />
              <span className="whitespace-nowrap">{recipe.time} minutes</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
});
