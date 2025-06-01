import { getPage } from "@/lib/data";
import { parseMetadata, parseSlug } from "@/lib/utils";
import { api } from "@/trpc/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const page = await getPage(parseSlug((await params).slug));

  if (!page) return {};

  return parseMetadata(
    page.title,
    page.description,
    `/${page.slug}`,
    page.image,
    "article",
  );
}

export async function generateStaticParams() {
  const pages = await api.public.page.getPages();

  return pages.map((page) => ({
    slug: page.slug.split("/").slice(1),
  }));
}

export default async function ({
  params,
}: { params: Promise<{ slug: string[] }> }) {
  const page = await getPage(parseSlug((await params).slug));

  if (!page) {
    notFound();
  }

  return <pre>{JSON.stringify(page, null, 2)}</pre>;
}
