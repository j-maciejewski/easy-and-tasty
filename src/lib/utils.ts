import { APP_NAME } from "@/consts";
import { env } from "@/env";
import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { OpenGraphType } from "next/dist/lib/metadata/types/opengraph-types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseSlug(slug: string[]) {
  return `/${slug.join("/")}`;
}

export function parseMetadata(
  title: string,
  description: string,
  slug: string,
  image?: string | null,
  type?: OpenGraphType,
): Metadata {
  return {
    title: `${title} - ${APP_NAME}`,
    description,
    openGraph: {
      type: type ?? "website",
      siteName: "Easy and Tasty",
      url: `${env.APP_URL}${slug}`,
      ...(image ? { images: { url: image } } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
    },
  };
}
