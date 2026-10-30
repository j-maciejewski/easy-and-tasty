import {
  getDashboardArticlePath,
  getDashboardRecipePath,
  Path,
} from "@/config";
import type { RouterOutputs } from "@/trpc/react";

export type MediaItem =
  RouterOutputs["authorized"]["media"]["getMedia"]["items"][number];

export type MediaUsage = MediaItem["usages"][number];

export const formatFileSize = (bytes: number) => {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1000 ** 2) return `${(bytes / 1000).toFixed(1)} KB`;

  return `${(bytes / 1000 ** 2).toFixed(2)} MB`;
};

export const formatUploadDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const getUsageHref = (usage: MediaUsage) => {
  switch (usage.type) {
    case "recipe":
      return getDashboardRecipePath(usage.id);
    case "article":
      return getDashboardArticlePath(usage.id);
    case "config":
      return usage.id === "header_navigation"
        ? Path.DASHBOARD_NAVIGATION
        : Path.DASHBOARD_ARTICLES;
    default:
      return Path.DASHBOARD_ARTICLES;
  }
};
