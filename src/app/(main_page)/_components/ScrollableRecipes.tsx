import { api } from "@/trpc/server";
import clsx from "clsx";
import { HTMLAttributes, forwardRef } from "react";
import { RecipeCard } from "./RecipeCard";

export const ScrollableRecipes = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { heading: string; subheading?: string }
>(async ({ className, heading, subheading, ...props }, ref) => {
  const recipes = await api.public.recipe.getRandomRecipes(10);

  return (
    <div className={clsx("flex flex-col", className)} {...props} ref={ref}>
      <h3 className="~text-xl/3xl font-semibold">{heading}</h3>
      {subheading && <p className="~text-sm/lg ~mt-2/3">{subheading}</p>}
      <div className="~mt-4/6 ~gap-4/6 flex overflow-auto">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            className="min-w-[16rem]"
          />
        ))}
      </div>
    </div>
  );
});
