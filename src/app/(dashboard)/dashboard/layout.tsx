import { Metadata } from "next";
import { Suspense } from "react";

import { Header, SessionWrapper, Sidebar } from "@/components/dashboard";
import { SidebarProvider, Toaster } from "@/components/ui";
import { APP_NAME } from "@/consts";
import { PaginationProvider, UserProvider } from "@/context";

export const metadata: Metadata = {
  title: `Dashboard - ${APP_NAME}`,
  icons: [{ rel: "icon", url: "/favicon-dashboard.png" }],
};

export default function ({ children }: React.PropsWithChildren) {
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
                  <PaginationProvider>{children}</PaginationProvider>
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
