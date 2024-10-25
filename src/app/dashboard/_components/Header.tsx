"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Path } from "@/config";
import { usePathname } from "next/navigation";
import { ToggleThemeButton } from "./ToggleThemeButton";

// TODO
const breadcrumbsLabels = new Map([
	[Path.DASHBOARD, "Summary"],
	[Path.DASHBOARD_RECIPES, "Recipes"],
]);

export const Header = () => {
	const pathname = usePathname();

	const label = breadcrumbsLabels.get(pathname as Path);

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
