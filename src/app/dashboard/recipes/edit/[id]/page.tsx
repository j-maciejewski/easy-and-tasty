import { EditRecipeForm } from "@/app/dashboard/_components";
import { CategoriesProvider, CuisinesProvider } from "@/app/dashboard/_context";
import { api } from "@/trpc/server";

export default async function ({
  params,
}: { params: Promise<{ id: string }> }) {
  const recipeId = (await params).id;
  const categories = await api.protected.category.getCategories();
  const cuisines = await api.protected.cuisine.getCuisines();

  return (
    <CategoriesProvider categories={categories}>
      <CuisinesProvider cuisines={cuisines}>
        <div className="mx-auto max-w-[60rem]">
          <EditRecipeForm recipeId={Number(recipeId)} />
        </div>
      </CuisinesProvider>
    </CategoriesProvider>
  );
}
