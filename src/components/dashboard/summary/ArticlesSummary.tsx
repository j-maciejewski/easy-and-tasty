"use client";

import { api } from "@/trpc/react";

import { ActivityList, TopContentList } from "./ContentLists";
import { SummarySection } from "./SummarySection";
import { SummarySkeleton } from "./SummarySkeleton";

export const ArticlesSummary = () => {
  const { data, error } = api.authorized.article.getSummaryStats.useQuery();

  if (error) {
    return <p className="text-destructive text-sm">{error.message}</p>;
  }

  if (!data) return <SummarySkeleton columns={2} />;

  return (
    <SummarySection
      noun="articles"
      content={data.content}
      totals={data.totals}
      trend={data.trend}
      engagementMetrics={["comments"]}
    >
      <TopContentList
        title="Top articles (last 30 days)"
        items={data.topViewed.map((article) => ({
          ...article,
          href: `/articles/${article.slug}`,
        }))}
      />
      <ActivityList
        title="Latest comments"
        emptyText="No recent comments."
        items={data.recentComments.map((comment) => ({
          id: comment.id,
          title: comment.article.title,
          href: `/articles/${comment.article.slug}`,
          author: comment.user?.name ?? "Anonymous",
          date: comment.createdAt,
          text: comment.text,
        }))}
      />
    </SummarySection>
  );
};
