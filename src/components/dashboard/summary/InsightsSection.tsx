"use client";

import { Skeleton } from "@/components/ui";
import { api } from "@/trpc/react";

import { BarList } from "./BarList";
import { EngagementFunnel } from "./EngagementFunnel";
import { ExportCsvButton } from "./ExportCsvButton";
import { formatNumber } from "./utils";

export const InsightsSection = ({
  entityType,
}: {
  entityType: "recipe" | "article";
}) => {
  const { data, error } = api.authorized.analytics.getInsights.useQuery({
    entityType,
  });

  if (error) {
    return <p className="text-destructive text-sm">{error.message}</p>;
  }

  const isRecipe = entityType === "recipe";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Reader insights</h2>
        <ExportCsvButton entityType={entityType} />
      </div>

      {!data ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, idx) => (
            <Skeleton key={idx} className="h-80 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <EngagementFunnel
            totals={data.funnel}
            conversions={[
              { label: "Comments", count: data.conversions.comments },
              ...(isRecipe
                ? [{ label: "Bookmarks", count: data.conversions.bookmarks }]
                : []),
            ]}
          />
          <BarList
            title="Traffic sources"
            description="Where views came from, last 30 days"
            emptyText="No views in the last 30 days."
            items={data.sources.map((source) => ({
              key: source.source,
              label: source.source,
              value: source.views,
            }))}
          />
          <BarList
            title="Trending"
            description="Biggest view growth, this week vs last"
            emptyText="Nothing is growing this week."
            items={data.trending.map((item) => ({
              key: item.id,
              label: item.title,
              href: item.href,
              value: item.views - item.previous,
              detail: `+${formatNumber(item.views - item.previous)} (${formatNumber(item.views)} this week)`,
            }))}
          />
          {isRecipe && (
            <>
              <BarList
                title="Views by category"
                description="Last 30 days"
                emptyText="No views in the last 30 days."
                items={data.categoryViews.map((category) => ({
                  key: category.name,
                  label: category.name,
                  value: category.views,
                }))}
              />
              <BarList
                title="Views by cuisine"
                description="Last 30 days"
                emptyText="No views in the last 30 days."
                items={data.cuisineViews.map((cuisine) => ({
                  key: cuisine.name,
                  label: cuisine.name,
                  value: cuisine.views,
                }))}
              />
              <div className="space-y-6">
                <BarList
                  title="Top searches"
                  description="Last 30 days"
                  emptyText="No searches in the last 30 days."
                  items={data.topSearches.map((search) => ({
                    key: search.term,
                    label: search.term,
                    value: search.count,
                  }))}
                />
                <BarList
                  title="Searches with no results"
                  description="Ideas for recipes to write next"
                  emptyText="Every search found something."
                  items={data.zeroResultSearches.map((search) => ({
                    key: search.term,
                    label: search.term,
                    value: search.count,
                  }))}
                />
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};
