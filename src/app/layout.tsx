import { GeistSans } from "geist/font/sans";

import { TooltipProvider } from "@/components/ui";
import { APP_DESCRIPTION, APP_NAME } from "@/consts";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function ({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="!overflow-x-hidden">
        <TRPCReactProvider>
          <TooltipProvider delayDuration={300} disableHoverableContent>
            {children}
          </TooltipProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
