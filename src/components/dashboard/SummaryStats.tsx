"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Skeleton,
} from "@/components/ui";
import { api } from "@/trpc/react";

const chartConfig = {
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
  views: {
    label: "Views",
    theme: {
      light: "oklch(0.7 0.14 205)",
      dark: "oklch(0.76 0.12 210)",
    },
  },
} satisfies ChartConfig;

function formatDateTime(value: Date | string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDayLabel(value: string) {
  const [yearPart = "1970", monthPart = "1", dayPart = "1"] = value.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  const day = Number(dayPart);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export const SummaryStats = () => {
  const { data, isLoading } = api.authorized.recipe.getSummaryStats.useQuery();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, idx) => (
            <Skeleton key={idx} className="h-36 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, idx) => (
            <Skeleton key={idx} className="h-105 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const periodData = [
    {
      period: "24h",
      comments: data.totals.comments.last24h,
      bookmarks: data.totals.bookmarks.last24h,
      views: data.totals.views.last24h,
    },
    {
      period: "7d",
      comments: data.totals.comments.last7d,
      bookmarks: data.totals.bookmarks.last7d,
      views: data.totals.views.last7d,
    },
    {
      period: "30d",
      comments: data.totals.comments.last30d,
      bookmarks: data.totals.bookmarks.last30d,
      views: data.totals.views.last30d,
    },
  ];

  const trendData = data.trend.map((entry) => ({
    ...entry,
    label: formatDayLabel(entry.day),
  }));

  const hasTrendActivity = trendData.some(
    (entry) => entry.comments > 0 || entry.bookmarks > 0 || entry.views > 0,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Comments</CardTitle>
            <CardDescription>Activity in selected windows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last 24h</span>
              <span className="font-semibold">
                {data.totals.comments.last24h}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last 7d</span>
              <span className="font-semibold">
                {data.totals.comments.last7d}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last 30d</span>
              <span className="font-semibold">
                {data.totals.comments.last30d}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Bookmarks</CardTitle>
            <CardDescription>Activity in selected windows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last 24h</span>
              <span className="font-semibold">
                {data.totals.bookmarks.last24h}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last 7d</span>
              <span className="font-semibold">
                {data.totals.bookmarks.last7d}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last 30d</span>
              <span className="font-semibold">
                {data.totals.bookmarks.last30d}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Views</CardTitle>
            <CardDescription>Activity in selected windows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last 24h</span>
              <span className="font-semibold">{data.totals.views.last24h}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last 7d</span>
              <span className="font-semibold">{data.totals.views.last7d}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last 30d</span>
              <span className="font-semibold">{data.totals.views.last30d}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Window Comparison</CardTitle>
            <CardDescription>24h vs 7d vs 30d</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <BarChart data={periodData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="period" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="comments"
                  fill="var(--color-comments)"
                  fillOpacity={0.9}
                  radius={6}
                />
                <Bar
                  dataKey="bookmarks"
                  fill="var(--color-bookmarks)"
                  fillOpacity={0.9}
                  radius={6}
                />
                <Bar
                  dataKey="views"
                  fill="var(--color-views)"
                  fillOpacity={0.9}
                  radius={6}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last 30 Days Trend</CardTitle>
            <CardDescription>
              Daily comments, bookmarks and views
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasTrendActivity ? (
              <ChartContainer config={chartConfig} className="h-80 w-full">
                <LineChart data={trendData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    minTickGap={28}
                  />
                  <YAxis allowDecimals={false} width={32} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="comments"
                    stroke="var(--color-comments)"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookmarks"
                    stroke="var(--color-bookmarks)"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="var(--color-views)"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-80 items-center justify-center rounded-xl border border-dashed text-muted-foreground text-sm">
                No activity recorded in the last 30 days yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Latest Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.recentComments.length === 0 ? (
              <p className="text-muted-foreground">No recent comments.</p>
            ) : (
              data.recentComments.map((comment) => (
                <div
                  key={comment.id}
                  className="space-y-1 border-b pb-3 last:border-0 last:pb-0"
                >
                  <p className="line-clamp-2 break-all break-all text-muted-">
                    {comment.text}
                  </p>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <Link
                      href={`/recipe/${comment.recipe.slug}`}
                      className="truncate font-medium hover:underline"
                    >
                      {comment.recipe.title}
                    </Link>
                    <span className="text-muted-foreground">
                      {formatDateTime(comment.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Bookmarks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.recentBookmarks.length === 0 ? (
              <p className="text-muted-foreground">No recent bookmarks.</p>
            ) : (
              data.recentBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="space-y-1 border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <Link
                      href={`/recipe/${bookmark.recipe.slug}`}
                      className="truncate font-medium hover:underline"
                    >
                      {bookmark.recipe.title}
                    </Link>
                    <span className="text-muted-foreground">
                      {formatDateTime(bookmark.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-muted-foreground text-xs">
                    {bookmark.user?.name ??
                      bookmark.user?.email ??
                      "Anonymous user"}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Views</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.recentViews.length === 0 ? (
              <p className="text-muted-foreground">No recent views.</p>
            ) : (
              data.recentViews.map((view) => (
                <div
                  key={view.id}
                  className="space-y-1 border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <Link
                      href={`/recipe/${view.recipe.slug}`}
                      className="truncate font-medium hover:underline"
                    >
                      {view.recipe.title}
                    </Link>
                    <span className="text-muted-foreground">
                      {formatDateTime(view.viewedAt)}
                    </span>
                  </div>
                  <p className="truncate text-muted-foreground text-xs">
                    {view.user?.name ??
                      view.user?.email ??
                      view.ipAddress ??
                      "Guest view"}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
