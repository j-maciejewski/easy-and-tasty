"use client";

import { api } from "@/trpc/react";

import { ActivityList, TopContentList } from "./ContentLists";
import { SummarySection } from "./SummarySection";
import { SummarySkeleton } from "./SummarySkeleton";

export const RecipesSummary = () => {
  const { data, error } = api.authorized.recipe.getSummaryStats.useQuery();

  if (error) {
    return <p className="text-destructive text-sm">{error.message}</p>;
  }

  if (!data) return <SummarySkeleton columns={3} />;

  return (
    <SummarySection
      noun="recipes"
      content={data.content}
      totals={data.totals}
      trend={data.trend}
      engagementMetrics={["comments", "bookmarks"]}
    >
      <TopContentList
        title="Top recipes (last 30 days)"
        items={data.topViewed.map((recipe) => ({
          ...recipe,
          href: `/recipe/${recipe.slug}`,
        }))}
      />
      <ActivityList
        title="Latest comments"
        emptyText="No recent comments."
        items={data.recentComments.map((comment) => ({
          id: comment.id,
          title: comment.recipe.title,
          href: `/recipe/${comment.recipe.slug}`,
          author: comment.user?.name ?? "Anonymous",
          date: comment.createdAt,
          text: comment.text,
        }))}
      />
      <ActivityList
        title="Latest bookmarks"
        emptyText="No recent bookmarks."
        items={data.recentBookmarks.map((bookmark) => ({
          id: bookmark.id,
          title: bookmark.recipe.title,
          href: `/recipe/${bookmark.recipe.slug}`,
          author: bookmark.user?.name ?? "Anonymous",
          date: bookmark.createdAt,
        }))}
      />
    </SummarySection>
  );
};
