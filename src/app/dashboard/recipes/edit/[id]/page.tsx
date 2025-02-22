import { EditRecipeForm } from "@/app/dashboard/_components";

export default async function ({
  params,
}: { params: Promise<{ id: string }> }) {
  const recipeId = (await params).id;

  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="container mx-auto max-w-[60rem] px-6 py-8">
        <EditRecipeForm recipeId={Number(recipeId)} />
      </div>
    </main>
  );
}
