import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import { api } from "@/trpc/server";
import { ThemeProvider } from "next-themes";
import { redirect } from "next/navigation";
import { Header } from "./_components/Header";
import { Sidebar } from "./_components/Sidebar";
import { CategoriesProvider, CuisinesProvider } from "./_context";

export default async function ({ children }: React.PropsWithChildren) {
	const categories = await api.protected.category.getCategories();
	const cuisines = await api.protected.cuisine.getCuisines();

	if (env.MOCK_MODE) redirect("/");

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<SidebarProvider>
				<CategoriesProvider categories={categories}>
					<CuisinesProvider cuisines={cuisines}>
						<div className="flex h-screen w-full overflow-hidden">
							<Sidebar />
							<div className="flex flex-1 flex-col overflow-hidden bg-background">
								<Header />
								{children}
							</div>
						</div>
						<Toaster richColors />
					</CuisinesProvider>
				</CategoriesProvider>
			</SidebarProvider>
		</ThemeProvider>
	);
}
