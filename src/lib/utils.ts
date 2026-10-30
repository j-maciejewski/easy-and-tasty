import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { OpenGraphType } from "next/dist/lib/metadata/types/opengraph-types";
import { twMerge } from "tailwind-merge";

import { APP_NAME } from "@/consts";
import { env } from "@/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseSlug(slug: string[]) {
  return `${slug.join("/")}`;
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

export function getImageTransitionName(path: string) {
  return `image-${path.replace(/[^\w-]/g, "-")}`;
}

const MAX_SERIAL_ID = 2_147_483_647;

export function parseId(value: string) {
  if (!/^\d+$/.test(value)) return null;

  const id = Number(value);

  return id > 0 && id <= MAX_SERIAL_ID ? id : null;
}
