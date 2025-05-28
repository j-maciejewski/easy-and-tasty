import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { seo, staticPageTypeEnum } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const publicSeoRouter = createTRPCRouter({
  getSeo: publicProcedure
    .input(z.enum(staticPageTypeEnum.enumValues))
    .query(async ({ ctx, input: pageType }) => {
      return ctx.db.query.seo.findFirst({
        columns: {
          title: true,
          description: true,
          image: true,
        },
        where: eq(seo.pageType, pageType),
      });
    }),
});
