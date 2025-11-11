import clsx from "clsx";
import { Metadata } from "next";

import {
  Banner,
  FullWidthWrapper,
  RecipeCard,
  RecipeCardFull,
  RecipesCarousel,
  RecipesList,
  ScrollableRecipes,
} from "@/components/app";
import { RecipesGroupPreview } from "@/components/app/RecipesGroupPreview";
import { Separator } from "@/components/ui";
import { getSeo, getSuggestedRecipes } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";

import { merienda } from "../fonts";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("home");

  if (!seo) return {};

  return parseMetadata(seo.title ?? "Home", seo.description, "", seo.image);
}

export default async function () {
  const recipes = await getSuggestedRecipes("carousel");

  return (
    <div className="flex w-full grow flex-col gap-4">
      {recipes ? (
        <>
          <FullWidthWrapper>
            <Banner
              title="Comfort Foods"
              text="Warm, hearty meals perfect for cozy evenings and family gatherings. From creamy casseroles and slow-cooked stews to savory pies and baked classics, these recipes bring comfort and nostalgia to your table, making every bite feel like home."
              image="/mock/banner.png"
              href={"/comfort-foods"}
            />
          </FullWidthWrapper>
          <RecipeCardFull recipe={recipes[0]!} />
          <div className="grid grid-cols-3 gap-4">
            <RecipeCard recipe={recipes[1]!} />
            <RecipeCard recipe={recipes[2]!} />
            <RecipeCard recipe={recipes[3]!} />
          </div>
          <RecipesCarousel recipes={recipes} />
          <FullWidthWrapper className="flex h-40 flex-col items-center justify-center gap-3 bg-red-300 font-bold text-white">
            <div className="flex flex-col items-center p-4 text-center">
              <span className={clsx("mb-2 text-xl", merienda.className)}>
                Browse our recipes
              </span>
              <span className="font-normal text-base">
                Find your favorite from over 1000+ recipes
              </span>
            </div>
          </FullWidthWrapper>
          <ScrollableRecipes
            recipes={recipes}
            heading="Breakfast recipes"
            subheading="Easy and quick to make breakfast recipes"
          />
          <Separator orientation="horizontal" />
          <RecipesGroupPreview cuisine={{ name: "Italian", slug: "italian" }} />
          <RecipesList heading="All Recipes" recipes={recipes} />
        </>
      ) : (
        <p>no results</p>
      )}
    </div>
  );
}
