import { Card, CardHeader, Separator } from "@/components/ui";
import { getSuggestedRecipes } from "@/lib/data";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, forwardRef } from "react";
import { Rating } from "./Rating";

export const RecipesList = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { heading: string; subheading?: string }
>(async ({ className, heading, subheading, ...props }, ref) => {
  const recipes = await getSuggestedRecipes("suggested");

  return (
    <div
      className={clsx("text-gray-600 text-sm", className)}
      {...props}
      ref={ref}
    >
      <h3 className="~text-base/lg font-semibold">{heading}</h3>
      {subheading && <p className="~text-sm/lg ~mt-2/3">{subheading}</p>}
      <div className="~mt-4/6 flex flex-col gap-2">
        {recipes.map((recipe) => (
          <Link key={recipe.id} href={`/recipe/${recipe.slug}`}>
            <Card className="py-0 shadow transition ease-in-out hover:opacity-80">
              <div className="flex items-center gap-2 rounded-lg">
                <Image
                  src={recipe.image}
                  width={200}
                  height={200}
                  alt={recipe.title}
                  loading="lazy"
                  className="size-20 min-w-20 rounded-lg object-cover"
                />
                <CardHeader className="grow p-2 font-medium text-sm">
                  <h6>{recipe.title}</h6>
                  <div className="~mt-2/4 flex gap-2 text-gray-600 text-sm">
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
                  </div>
                </CardHeader>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
});
