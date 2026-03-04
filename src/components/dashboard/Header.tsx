"use client";

import { usePathname } from "next/navigation";

import { Separator, SidebarTrigger } from "@/components/ui";
import { Path } from "@/config";

import { ToggleThemeButton } from "./ToggleThemeButton";

const breadcrumbsLabels = new Map<Path | RegExp, string>([
  [Path.DASHBOARD, "Summary"],
  [Path.DASHBOARD_RECIPES, "Recipes"],
  [Path.DASHBOARD_HOME, "Home"],
  [Path.DASHBOARD_CATEGORIES, "Categories"],
  [Path.DASHBOARD_CUISINES, "Cuisines"],
  [Path.DASHBOARD_USERS, "Users"],
  [Path.DASHBOARD_NAVIGATION, "Navigation"],
  [Path.DASHBOARD_SETTINGS, "Settings"],
  [Path.DASHBOARD_PAGES, "Pages"],
]);

export const Header = () => {
  const pathname = usePathname();

  const label = [...breadcrumbsLabels.entries()].find(
    ([path]) => path === pathname,
  )?.[1];

  return (
    <header className="bg-card shadow-sm">
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
