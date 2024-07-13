import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata = {
	title: "easy and tasty",
	description: "Find your new favorite recipe",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function ({ children }: React.PropsWithChildren) {
	return (
		<html lang="en" className={`${GeistSans.variable}`}>
			<body>
				<TRPCReactProvider>
					<TooltipProvider delayDuration={300} disableHoverableContent>
						{children}
					</TooltipProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
