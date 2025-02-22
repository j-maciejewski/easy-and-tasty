import { APP_NAME } from "@/consts";
import { env } from "@/env";
import { api } from "@/trpc/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

const fetchPage = cache(async (slug: string[]) => {
  return await api.public.page.getPage(`/${slug.join("/")}`);
});

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const page = await fetchPage((await params).slug);

  if (!page) return {};

  return {
    title: `${page.title} - ${APP_NAME}`,
    description: page.description,
    openGraph: {
      type: "article",
      siteName: "Easy and Tasty",
      url: `${env.APP_URL}${page.slug}`,
      ...(page.image ? { images: { url: page.image } } : {}),
    },
    twitter: {
      card: page.image ? "summary_large_image" : "summary",
    },
  };
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
  const page = await fetchPage((await params).slug);

  if (!page) {
    notFound();
  }

  return <pre>{JSON.stringify(page, null, 2)}</pre>;
}
