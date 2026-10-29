"use client";

import { usePathname } from "next/navigation";

import { Separator, SidebarTrigger } from "@/components/ui";
import { Path } from "@/config";

import { ToggleThemeButton } from "./ToggleThemeButton";

const breadcrumbsLabels = new Map<Path | RegExp, string>([
  [Path.DASHBOARD, "Summary"],
  [Path.DASHBOARD_RECIPES, "Recipes"],
  [Path.DASHBOARD_ARTICLES, "Articles"],
  [Path.DASHBOARD_CATEGORIES, "Categories"],
  [Path.DASHBOARD_CUISINES, "Cuisines"],
  [Path.DASHBOARD_USERS, "Users"],
  [Path.DASHBOARD_NAVIGATION, "Navigation"],
]);

export const Header = () => {
  const pathname = usePathname();

  const label = [...breadcrumbsLabels.entries()].find(
    ([path]) => path === pathname,
  )?.[1];

  return (
    <header className="bg-card shadow-sm">
      <div className="mx-auto flex items-center px-4 py-4 sm:px-6 lg:px-8">
        <SidebarTrigger className="text-foreground size-9" />
        <Separator orientation="vertical" className="mx-4 min-h-6" />
        <h3 className="text-foreground mr-auto text-lg font-semibold">
          {label}
        </h3>
        <ToggleThemeButton />
      </div>
    </header>
  );
};
