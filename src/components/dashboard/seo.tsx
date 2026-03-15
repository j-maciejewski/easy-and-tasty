import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { api } from "@/trpc/react";

import { SeoSection } from "./SeoSection";

export const SeoContent = () => {
  const { data: seoConfig, isLoading } =
    api.authorized.seo.getSeoConfig.useQuery();

  if (isLoading) return "Loading...";

  return (
    <Tabs defaultValue="home" className="gap-4">
      <TabsList className="h-auto w-full justify-start overflow-x-auto">
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="cuisines">Cuisines</TabsTrigger>
        <TabsTrigger value="recipes">Recipes</TabsTrigger>
        <TabsTrigger value="articles">All articles</TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <SeoSection label="Home" type="home" data={seoConfig?.home} />
      </TabsContent>
      <TabsContent value="categories">
        <SeoSection
          label="Categories"
          type="categories"
          data={seoConfig?.categories}
        />
      </TabsContent>
      <TabsContent value="cuisines">
        <SeoSection
          label="Cuisines"
          type="cuisines"
          data={seoConfig?.cuisines}
        />
      </TabsContent>
      <TabsContent value="recipes">
        <SeoSection label="Recipes" type="recipes" data={seoConfig?.recipes} />
      </TabsContent>
      <TabsContent value="articles">
        <SeoSection
          label="All articles"
          type="articles"
          data={seoConfig?.articles}
        />
      </TabsContent>
    </Tabs>
  );
};
