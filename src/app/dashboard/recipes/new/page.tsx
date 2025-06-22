import { api } from "@/trpc/server";

import { AddRecipeForm } from "../../_components";
import { CategoriesProvider, CuisinesProvider } from "../../_context";

export const dynamic = "force-dynamic";

export default async function () {
  const categories = await api.authorized.category.getCategories();
  const cuisines = await api.authorized.cuisine.getCuisines();

  return (
    <CategoriesProvider categories={categories}>
      <CuisinesProvider cuisines={cuisines}>
        <div className="mx-auto max-w-[60rem]">
          <AddRecipeForm />
        </div>
      </CuisinesProvider>
    </CategoriesProvider>
  );
}
