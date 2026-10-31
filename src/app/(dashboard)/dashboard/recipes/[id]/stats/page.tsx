import { notFound } from "next/navigation";

import { EntityStats } from "@/components/dashboard";
import { parseId } from "@/lib/utils";

export default async function ({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  if (!id) notFound();

  return <EntityStats entityType="recipe" id={id} />;
}
