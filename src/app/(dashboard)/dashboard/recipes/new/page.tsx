import { AddRecipeForm } from "@/components/dashboard";
import { CategoriesProvider, CuisinesProvider } from "@/context";
import { api } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function () {
  const categories = await api.authorized.category.getCategories();
  const cuisines = await api.authorized.cuisine.getCuisines();

  return (
    <CategoriesProvider categories={categories}>
      <CuisinesProvider cuisines={cuisines}>
        <div className="mx-auto max-w-240">
          <AddRecipeForm />
        </div>
      </CuisinesProvider>
    </CategoriesProvider>
  );
}
