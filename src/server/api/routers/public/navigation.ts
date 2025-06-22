import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { config } from "@/server/db/schema";

export const publicNavigationRouter = createTRPCRouter({
  getNavigation: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.query.config.findFirst({
      columns: {
        data: true,
      },
      where: eq(config.configType, "header_navigation"),
    });

    return (
      (data?.data as {
        label: string;
        href?: string;
        sublinks: { label: string; href: string }[];
      }[]) ?? []
    );
  }),
});
