import { notFound } from "next/navigation";

import { PageForm } from "@/components/dashboard";
import { parseId } from "@/lib/utils";
import { api } from "@/trpc/server";

export default async function ({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const article = await api.authorized.article.getArticleById(id);
  if (!article) notFound();

  return <PageForm pageId={id} />;
}
