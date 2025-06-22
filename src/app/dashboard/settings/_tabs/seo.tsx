import { api } from "@/trpc/react";

import { SeoSection } from "../../_components";

export const SeoContent = () => {
  const { data: seoConfig, isLoading } =
    api.authorized.seo.getSeoConfig.useQuery();

  if (isLoading) return "Loading...";

  return (
    <div className="space-y-5">
      <SeoSection label="Home" type="home" data={seoConfig?.home} />
      <SeoSection
        label="Categories"
        type="categories"
        data={seoConfig?.categories}
      />
      <SeoSection label="Cuisines" type="cuisines" data={seoConfig?.cuisines} />
      <SeoSection label="Recipes" type="recipes" data={seoConfig?.recipes} />
    </div>
  );
};
