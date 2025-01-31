import { EditRecipeForm } from "@/app/dashboard/_components/EditRecipeForm";

export default async function ({
  params,
}: { params: Promise<{ id: string }> }) {
  const recipeId = (await params).id;

  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="container mx-auto px-6 py-8">
        <EditRecipeForm recipeId={Number(recipeId)} />
      </div>
    </main>
  );
}
