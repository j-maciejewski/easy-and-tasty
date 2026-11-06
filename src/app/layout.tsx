import { GeistSans } from "geist/font/sans";

import { ServiceWorkerRegistration } from "@/components/app/ServiceWorkerRegistration";
import { TooltipProvider } from "@/components/ui";
import { APP_DESCRIPTION, APP_NAME, APP_THEME_COLOR } from "@/consts";
import { NextAuthProvider } from "@/context";
import { TRPCReactProvider } from "@/trpc/react";
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { bricolage } from "./fonts";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  icons: {
    icon: "/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: APP_THEME_COLOR,
};

export default function ({ children }: React.PropsWithChildren) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${bricolage.variable}`}
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden!">
        <NextAuthProvider>
          <TRPCReactProvider>
            <TooltipProvider delayDuration={300} disableHoverableContent>
              {children}
              <ServiceWorkerRegistration />
            </TooltipProvider>
          </TRPCReactProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
