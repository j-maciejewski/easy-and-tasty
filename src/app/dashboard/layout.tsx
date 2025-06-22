import { Metadata } from "next";
import { Suspense } from "react";

import { SidebarProvider, Toaster } from "@/components/ui";
import { APP_NAME } from "@/consts";

import { Header, SessionWrapper, Sidebar } from "./_components";
import { PaginationProvider, ThemeProvider, UserProvider } from "./_context";

export const metadata: Metadata = {
  title: `Dashboard - ${APP_NAME}`,
  icons: [{ rel: "icon", url: "/favicon-dashboard.png" }],
};

export default function ({ children }: React.PropsWithChildren) {
  return (
    <div data-view="dashboard">
      <UserProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper>
            <SidebarProvider>
              <div className="flex h-screen w-full overflow-hidden">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-muted/30">
                  <Header />
                  <main className="container mx-auto flex-1 px-6 py-8">
                    <Suspense>
                      <PaginationProvider>{children}</PaginationProvider>
                    </Suspense>
                  </main>
                </div>
              </div>
              <Toaster richColors />
            </SidebarProvider>
          </SessionWrapper>
        </ThemeProvider>
      </UserProvider>
    </div>
  );
}
