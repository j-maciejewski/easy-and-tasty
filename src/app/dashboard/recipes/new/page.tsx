import { api } from "@/trpc/server";
import { AddRecipeForm } from "../../_components";
import { CategoriesProvider, CuisinesProvider } from "../../_context";

export default async function () {
  const categories = await api.protected.category.getCategories();
  const cuisines = await api.protected.cuisine.getCuisines();

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
