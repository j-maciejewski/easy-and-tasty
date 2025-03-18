import { SidebarProvider, Toaster } from "@/components/ui";
import { env } from "@/env";
import { redirect } from "next/navigation";
import { Header, Sidebar } from "./_components";
import { PaginationProvider, ThemeProvider, UserProvider } from "./_context";
import "./styles.css";
import { Suspense } from "react";

export default async function ({ children }: React.PropsWithChildren) {
  if (env.MOCK_MODE) redirect("/");

  return (
    <UserProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
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
      </ThemeProvider>
    </UserProvider>
  );
}
