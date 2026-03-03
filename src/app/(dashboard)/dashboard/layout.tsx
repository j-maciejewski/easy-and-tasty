import { Metadata } from "next";
import { Suspense } from "react";

import { Header, SessionWrapper, Sidebar } from "@/components/dashboard";
import { SidebarProvider, Toaster } from "@/components/ui";
import { APP_NAME } from "@/consts";
import {
  CategoriesProvider,
  CuisinesProvider,
  PaginationProvider,
  UserProvider,
} from "@/context";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: `Dashboard - ${APP_NAME}`,
  icons: [{ rel: "icon", url: "/favicon-dashboard.png" }],
};

export const dynamic = "force-dynamic";

export default async function ({ children }: React.PropsWithChildren) {
  const categories = await api.authorized.category.getCategories();
  const cuisines = await api.authorized.cuisine.getCuisines();

  return (
    <UserProvider>
      <SessionWrapper>
        <SidebarProvider>
          <div className="flex h-screen w-full overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-muted/80">
              <Header />
              <main className="mx-auto w-full flex-1 px-6 py-8">
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
    </UserProvider>
  );
}
