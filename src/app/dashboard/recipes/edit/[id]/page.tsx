import { EditRecipeForm } from "@/app/dashboard/_components";
import { CategoriesProvider, CuisinesProvider } from "@/app/dashboard/_context";
import { api } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function ({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const recipeId = (await params).id;
  const categories = await api.authorized.category.getCategories();
  const cuisines = await api.authorized.cuisine.getCuisines();

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
