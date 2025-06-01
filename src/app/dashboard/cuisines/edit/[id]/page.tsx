import { EditCuisineForm } from "@/app/dashboard/_components";

export const dynamic = "force-dynamic";

export default async function ({
  params,
}: { params: Promise<{ id: string }> }) {
  const cuisineId = (await params).id;

  return (
    <div className="mx-auto max-w-[60rem]">
      <EditCuisineForm cuisineId={Number(cuisineId)} />
    </div>
  );
}
