import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, forwardRef } from "react";
import { recipeImageSrcParser } from "../_utils";

export namespace RecipeCard {
  export interface Props {
    recipe: Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
      RecipeRatingOptions;
  }
}
export const RecipeCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & RecipeCard.Props
>(({ className, recipe, ...props }, _ref) => {
  return (
    <Link href={`/recipe/${recipe.slug}`} className="relative">
      <Image
        src={recipeImageSrcParser(recipe.image)}
        width={400}
        height={600}
        alt={recipe.title}
        loading="lazy"
        className="max-h-[325px] min-h-[325px] w-full min-w-[250px] object-cover transition ease-in-out hover:opacity-90"
        {...props}
      />
      <h3
        className="absolute bottom-3 left-3 z-10 font-semibold text-2xl text-white"
        style={{ textShadow: "1px 2px black" }}
      >
        {recipe.title}
      </h3>
    </Link>
  );
});
