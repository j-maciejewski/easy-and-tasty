"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { Card, Skeleton } from "@/components/ui";
import { api } from "@/trpc/react";

import { BarList } from "../summary/BarList";
import { EngagementFunnel } from "../summary/EngagementFunnel";
import { TrendChart } from "../summary/TrendChart";
import { formatNumber } from "../summary/utils";

const shareChannelLabels: Record<string, string> = {
  copy_link: "Copied link",
  facebook: "Facebook",
  twitter: "Twitter",
};

const averageFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const EntityStats = ({
  entityType,
  id,
}: {
  entityType: "recipe" | "article";
  id: number;
}) => {
  const { data, error } = api.authorized.analytics.getEntityStats.useQuery({
    entityType,
    id,
  });

  if (error) {
    return <p className="text-destructive text-sm">{error.message}</p>;
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-80 rounded-lg" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, idx) => (
            <Skeleton key={idx} className="h-18 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const isRecipe = entityType === "recipe";
  const tiles = [
    { label: "Views · all time", value: formatNumber(data.allTime.views) },
    { label: "Views · last 30 days", value: formatNumber(data.recent.views) },
    { label: "Comments · all time", value: formatNumber(data.comments) },
    ...(isRecipe
      ? [
          {
            label: "Bookmarks · all time",
            value: formatNumber(data.bookmarks),
          },
          {
            label: "Rating",
            value: data.ratings.count
              ? `${averageFormat.format(data.ratings.average)}★ (${formatNumber(data.ratings.count)})`
              : "—",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="truncate text-xl font-semibold">{data.title}</h2>
        <Link
          href={data.href}
          target="_blank"
          rel="noopener"
          aria-label={`View ${data.title} on site`}
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          <ExternalLink className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {tiles.map((tile) => (
          <Card key={tile.label} className="gap-1 px-5 py-4">
            <p className="text-muted-foreground text-xs font-medium">
              {tile.label}
            </p>
            <p className="text-xl font-semibold tabular-nums">{tile.value}</p>
          </Card>
        ))}
      </div>

      <TrendChart
        title="Views and engaged reads"
        description="Daily, last 30 days"
        variant="area"
        metrics={["views", "engaged"]}
        data={data.trend}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <EngagementFunnel totals={data.recent} conversions={[]} />
        <BarList
          title="Traffic sources"
          description="Last 30 days"
          emptyText="No views in the last 30 days."
          items={data.sources.map((source) => ({
            key: source.source,
            label: source.source,
            value: source.views,
          }))}
        />
        <BarList
          title="Shares by channel"
          description="Last 30 days"
          emptyText="No shares in the last 30 days."
          items={data.shareChannels.map((share) => ({
            key: share.channel,
            label: shareChannelLabels[share.channel] ?? share.channel,
            value: share.count,
          }))}
        />
      </div>
    </div>
  );
};
