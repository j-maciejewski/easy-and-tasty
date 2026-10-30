"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import {
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";

import { ArticlesSummary } from "./summary/ArticlesSummary";
import { RecipesSummary } from "./summary/RecipesSummary";
import { SummarySkeleton } from "./summary/SummarySkeleton";

const tabTriggerClassName =
  "data-[state=active]:bg-card data-[state=active]:text-foreground px-4";

const SummaryTabs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "articles" ? "articles" : "recipes";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "articles") params.set("tab", value);
    else params.delete("tab");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange}>
      <TabsList className="h-10 p-1">
        <TabsTrigger value="recipes" className={tabTriggerClassName}>
          Recipes
        </TabsTrigger>
        <TabsTrigger value="articles" className={tabTriggerClassName}>
          Articles
        </TabsTrigger>
      </TabsList>
      <TabsContent value="recipes" className="mt-4">
        <RecipesSummary />
      </TabsContent>
      <TabsContent value="articles" className="mt-4">
        <ArticlesSummary />
      </TabsContent>
    </Tabs>
  );
};

export const SummaryStats = () => (
  <Suspense
    fallback={
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <SummarySkeleton />
      </div>
    }
  >
    <SummaryTabs />
  </Suspense>
);
