import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Breadcrumbs, RecipesList } from "@/components/app";
import { Separator } from "@/components/ui";
import { getPage, getSuggestedRecipes } from "@/lib/data";
import { parseMetadata, parseSlug } from "@/lib/utils";
import { api } from "@/trpc/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
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
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const page = await getPage(parseSlug((await params).slug));
  const recipes = await getSuggestedRecipes("recipe-page");

  console.log(parseSlug((await params).slug), page);

  if (!page) {
    notFound();
  }

  return (
    <div className="flex max-lg:flex-col max-lg:gap-4 lg:gap-10">
      <div className="grow">
        <Breadcrumbs
          paths={[{ label: "Article" }, { label: page.title, active: true }]}
          shareConfig={{
            path: `/${page.slug}`,
            text: "Check out this awesome article!",
            type: "article",
          }}
        />
        <h2 className="mb-4 font-semibold text-2xl">{page.title}</h2>
        <div className="mb-4 max-h-[700px] overflow-hidden rounded-lg">
          <Image
            src={page.image!}
            width={900}
            height={700}
            alt={page.title!}
            loading="lazy"
            className="mx-auto max-h-[700px] min-h-full w-full object-cover max-sm:w-full"
          />
        </div>
      </div>
      <Separator orientation="horizontal" className="lg:hidden" />
      <RecipesList
        heading="Try out our other recipes!"
        className="mb-4 min-w-[20rem] lg:pt-4"
        recipes={recipes}
      />
    </div>
  );
}
