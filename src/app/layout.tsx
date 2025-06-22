import { GeistSans } from "geist/font/sans";
import { unstable_ViewTransition as ViewTransition } from "react";

import { TooltipProvider } from "@/components/ui";
import { APP_DESCRIPTION, APP_NAME } from "@/consts";
import { TRPCReactProvider } from "@/trpc/react";

import { NextAuthProvider } from "./(shared)/context/NextAuthProvider";
import "@/styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.png" }],
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
