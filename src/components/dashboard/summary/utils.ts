import type { ChartConfig } from "@/components/ui";

export type Metric = "views" | "comments" | "bookmarks";

export type WindowCounts = {
  last24h: number;
  last7d: number;
  last30d: number;
  prev30d: number;
};

export type TrendPoint = { day: string } & Partial<Record<Metric, number>>;

export const chartConfig = {
  views: {
    label: "Views",
    theme: {
      light: "oklch(0.7 0.14 205)",
      dark: "oklch(0.76 0.12 210)",
    },
  },
  comments: {
    label: "Comments",
    theme: {
      light: "oklch(0.68 0.19 28)",
      dark: "oklch(0.72 0.16 24)",
    },
  },
  bookmarks: {
    label: "Bookmarks",
    theme: {
      light: "oklch(0.6 0.2 305)",
      dark: "oklch(0.69 0.16 304)",
    },
  },
} satisfies ChartConfig;

const standardFormat = new Intl.NumberFormat(undefined);
const compactFormat = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});
const percentFormat = new Intl.NumberFormat(undefined, {
  style: "percent",
  maximumFractionDigits: 0,
});

export const formatNumber = (value: number) =>
  value >= 10_000 ? compactFormat.format(value) : standardFormat.format(value);

export const formatPercent = (value: number) => percentFormat.format(value);

export const formatDay = (dayKey: string) => {
  const [year = 1970, month = 1, day = 1] = dayKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

export const formatDateTime = (value: Date | string) =>
  new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
