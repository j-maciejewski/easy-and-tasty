"use client";

import { Suspense } from "react";

import { Skeleton } from "@/components/ui";

import { ContentTabs } from "./ContentTabs";
import { InsightsSection } from "./summary/InsightsSection";

export const TrackingStats = () => (
  <Suspense fallback={<Skeleton className="h-10 w-48 rounded-lg" />}>
    <ContentTabs
      recipes={<InsightsSection entityType="recipe" />}
      articles={<InsightsSection entityType="article" />}
    />
  </Suspense>
);
