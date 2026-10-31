"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

const tabTriggerClassName =
  "data-[state=active]:bg-card data-[state=active]:text-foreground px-4";

// Recipes/Articles tabs kept in the ?tab= search param so the selection
// survives reloads and can be linked to. Must render inside <Suspense>.
export const ContentTabs = ({
  recipes,
  articles,
}: {
  recipes: ReactNode;
  articles: ReactNode;
}) => {
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
        {recipes}
      </TabsContent>
      <TabsContent value="articles" className="mt-4">
        {articles}
      </TabsContent>
    </Tabs>
  );
};
