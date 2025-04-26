import { TooltipProvider } from "@/components/ui";
import { APP_DESCRIPTION, APP_NAME } from "@/consts";
import { TRPCReactProvider } from "@/trpc/react";
import { GeistSans } from "geist/font/sans";
import { unstable_ViewTransition as ViewTransition } from "react";
import { NextAuthProvider } from "./(shared)/context/NextAuthProvider";
import "@/styles/globals.css";

export const metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function ({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="!overflow-x-hidden">
        <NextAuthProvider>
          <TRPCReactProvider>
            <TooltipProvider delayDuration={300} disableHoverableContent>
              <ViewTransition>{children}</ViewTransition>
            </TooltipProvider>
          </TRPCReactProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
