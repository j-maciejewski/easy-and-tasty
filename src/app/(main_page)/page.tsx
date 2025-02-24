import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/consts";
import { api } from "@/trpc/server";
import {
  Banner,
  FullWidthWrapper,
  RecipesCarousel,
  RecipesGroupPreview,
  ScrollableRecipes,
} from "./_components";

export function generateMetadata() {
  return {
    title: `Home | ${APP_NAME}`,
  };
}

export default async function () {
  const recipes = await api.public.recipe.getRandomRecipes(2);

  return (
    <>
      <div className="~gap-4/6 flex w-full grow flex-col">
        {recipes ? (
          <>
            <Banner
              title="Comfort Foods"
              text="Warm, hearty meals perfect for cozy evenings and family gatherings. From creamy casseroles and slow-cooked stews to savory pies and baked classics, these recipes bring comfort and nostalgia to your table, making every bite feel like home."
              image="/mock/banner.png"
              href={"/comfort-foods"}
            />
            <RecipesCarousel recipes={recipes} />
            <FullWidthWrapper className="flex h-40 flex-col items-center justify-center gap-3 bg-red-300 font-bold text-white">
              <div className="~p-4/6 flex flex-col items-center text-center">
                <span className="~/xl:~text-xl/2xl ~mb-2/3">
                  Browse our recipes
                </span>
                <span className="~/xl:~text-base/lg font-normal">
                  Find your favorite from over 1000+ recipes
                </span>
              </div>
            </FullWidthWrapper>
            <ScrollableRecipes
              heading="Breakfast recipes"
              subheading="Easy and quick to make breakfast recipes"
            />
            <Separator orientation="horizontal" />
            <RecipesGroupPreview
              cuisine={{ name: "Italian", slug: "italian" }}
            />
          </>
        ) : (
          <p>no results</p>
        )}
      </div>
    </>
  );
}
