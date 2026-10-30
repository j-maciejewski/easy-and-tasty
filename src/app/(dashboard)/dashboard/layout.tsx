import { Metadata } from "next";
import { Suspense } from "react";

import { Header, SessionWrapper, Sidebar } from "@/components/dashboard";
import { SidebarProvider, Toaster } from "@/components/ui";
import { APP_NAME } from "@/consts";
import {
  CategoriesProvider,
  CuisinesProvider,
  PaginationProvider,
} from "@/context";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: `Dashboard - ${APP_NAME}`,
  icons: [{ rel: "icon", url: "/favicon-dashboard.png" }],
};

export const dynamic = "force-dynamic";

export default async function ({ children }: React.PropsWithChildren) {
  const [categories, cuisines] = await Promise.all([
    api.authorized.category.getCategories(),
    api.authorized.cuisine.getCuisines(),
  ]);

  return (
    <SessionWrapper>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <Sidebar />
          <div className="bg-background flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Header />
            <main className="mx-auto w-full max-w-screen-2xl flex-1 px-6 py-8">
              <Suspense>
                <CategoriesProvider categories={categories}>
                  <CuisinesProvider cuisines={cuisines}>
                    <PaginationProvider>{children}</PaginationProvider>
                  </CuisinesProvider>
                </CategoriesProvider>
              </Suspense>
            </main>
          </div>
        </div>
        <Toaster richColors />
      </SidebarProvider>
    </SessionWrapper>
  );
}
