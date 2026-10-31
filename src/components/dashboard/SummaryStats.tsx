"use client";

import { Suspense } from "react";

import { Skeleton } from "@/components/ui";

import { ContentTabs } from "./ContentTabs";
import { ArticlesSummary } from "./summary/ArticlesSummary";
import { RecipesSummary } from "./summary/RecipesSummary";
import { SummarySkeleton } from "./summary/SummarySkeleton";

export const SummaryStats = () => (
  <Suspense
    fallback={
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <SummarySkeleton />
      </div>
    }
  >
    <ContentTabs recipes={<RecipesSummary />} articles={<ArticlesSummary />} />
  </Suspense>
);
