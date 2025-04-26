import { Separator } from "@/components/ui";
import { APP_NAME } from "@/consts";
import { api } from "@/trpc/server";
import { Suspense } from "react";
import { Breadcrumbs, InfiniteRecipeList, SortSelect } from "../_components";

export async function generateMetadata() {
  return {
    title: `All recipes | ${APP_NAME}`,
  };
}

export default async function () {
  const [countResponse] = await api.public.recipe.getTotalRecipesCount();

  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "All recipes", active: true }]} />
      <h2 className="~mb-4/6 ~text-2xl/4xl font-semibold tracking-normal">
        All recipes
      </h2>
      <Separator className="~my-4/6" />
      <h4 className="~mb-2/3 ~text-xl/3xl text-center font-semibold tracking-normal">
        Explore all recipes
      </h4>
      <div className="~mb-4/6 flex justify-between">
        <p className="content-center text-md">
          {countResponse && `Recipes: ${countResponse.count}`}
        </p>
        <Suspense>
          <SortSelect />
        </Suspense>
      </div>
      <Suspense>
        <InfiniteRecipeList type="all" />
      </Suspense>
    </div>
  );
}
