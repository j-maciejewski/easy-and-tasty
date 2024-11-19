"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Path } from "@/config";
import { usePathname } from "next/navigation";
import { ToggleThemeButton } from "./ToggleThemeButton";

const SLUG_REGEX = "([a-zA-Z0-9_-]+)";

const breadcrumbsLabels = new Map<Path | RegExp, string>([
	[Path.DASHBOARD, "Summary"],
	[Path.DASHBOARD_RECIPES, "Recipes"],
	[Path.DASHBOARD_NEW_RECIPE, "New Recipe"],
	[new RegExp(`^${Path.DASHBOARD_RECIPES}/edit/${SLUG_REGEX}$`), "Edit Recipe"],
]);

export const Header = () => {
	const pathname = usePathname();

	const label = [...breadcrumbsLabels.entries()].find(([path]) => {
		if (typeof path === "string") {
			return path === pathname;
		}

		return path.test(pathname);
	})?.[1];

	return (
		<header className="shadow-sm">
			<div className="mx-auto flex items-center px-4 py-4 sm:px-6 lg:px-8">
				<SidebarTrigger className="size-5" />
				<Separator orientation="vertical" className="mx-4 h-6" />
				<h3 className="mr-auto font-semibold text-foreground text-lg">
					{label}
				</h3>
				<ToggleThemeButton />
			</div>
		</header>
	);
};
