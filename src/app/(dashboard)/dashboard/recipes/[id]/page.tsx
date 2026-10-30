import { notFound } from "next/navigation";

import { RecipeForm } from "@/components/dashboard";
import { parseId } from "@/lib/utils";
import { api } from "@/trpc/server";

export default async function ({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const recipe = await api.authorized.recipe.getRecipe(id);
  if (!recipe) notFound();

  return <RecipeForm recipeId={id} />;
}
