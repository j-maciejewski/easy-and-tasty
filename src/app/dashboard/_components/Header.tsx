"use client";

import { usePathname } from "next/navigation";

import { Separator, SidebarTrigger } from "@/components/ui";
import { Path } from "@/config";

import { ToggleThemeButton } from "./ToggleThemeButton";

const SLUG_REGEX = "([a-zA-Z0-9_-]+)";

const breadcrumbsLabels = new Map<Path | RegExp, string>([
  [Path.DASHBOARD, "Summary"],
  [Path.DASHBOARD_RECIPES, "Recipes"],
  [Path.DASHBOARD_CATEGORIES, "Categories"],
  [Path.DASHBOARD_CUISINES, "Cuisines"],
  [Path.DASHBOARD_CUISINES, "Cuisines"],
  [Path.DASHBOARD_SETTINGS, "Settings"],
  [Path.DASHBOARD_NEW_RECIPE, "New Recipe"],
  [Path.DASHBOARD_NEW_CATEGORY, "New Category"],
  [Path.DASHBOARD_NEW_CUISINE, "New Cuisine"],
  [new RegExp(`^${Path.DASHBOARD_RECIPES}/edit/${SLUG_REGEX}$`), "Edit Recipe"],
  [
    new RegExp(`^${Path.DASHBOARD_CATEGORIES}/edit/${SLUG_REGEX}$`),
    "Edit Category",
  ],
  [
    new RegExp(`^${Path.DASHBOARD_CUISINES}/edit/${SLUG_REGEX}$`),
    "Edit Cuisine",
  ],
  [Path.DASHBOARD_PAGES, "Pages"],
  [Path.DASHBOARD_ADD_PAGE, "New Page"],
  [new RegExp(`^${Path.DASHBOARD_PAGES}/edit/${SLUG_REGEX}$`), "Edit Page"],
]);

export const Header = () => {
  const pathname = usePathname();

  const label = [...breadcrumbsLabels.entries()].find(([path]) =>
    typeof path === "string" ? path === pathname : path.test(pathname),
  )?.[1];

  return (
    <header className="bg-background shadow-sm">
      <div className="mx-auto flex items-center px-4 py-4 sm:px-6 lg:px-8">
        <SidebarTrigger className="size-9 text-foreground" />
        <Separator orientation="vertical" className="mx-4 min-h-6" />
        <h3 className="mr-auto font-semibold text-foreground text-lg">
          {label}
        </h3>
        <ToggleThemeButton />
      </div>
    </header>
  );
};
