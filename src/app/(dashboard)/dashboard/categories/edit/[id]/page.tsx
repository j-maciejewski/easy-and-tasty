import { EditCategoryForm } from "@/components/dashboard";

export const dynamic = "force-dynamic";

export default async function ({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const categoryId = (await params).id;

  return (
    <div className="mx-auto max-w-[60rem]">
      <EditCategoryForm categoryId={Number(categoryId)} />
    </div>
  );
}
