import { revalidateTag } from "next/cache";
import { z } from "zod";

import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { seo, staticPageTypeEnum } from "@/server/db/schema";

export const authorizedSeoRouter = createTRPCRouter({
  getSeoConfig: authorizedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db.query.seo.findMany();

    return results.reduce(
      (acc, { pageType, ...data }) => {
        acc[pageType] = data;
        return acc;
      },
      {} as Record<
        (typeof staticPageTypeEnum.enumValues)[number],
        Omit<typeof seo.$inferSelect, "pageType">
      >,
    );
  }),

  updateSeoConfig: authorizedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        image: z.string().optional(),
        pageType: z.enum(staticPageTypeEnum.enumValues),
      }),
    )
    .mutation(
      async ({ ctx, input: { title, description, image, pageType } }) => {
        const result = await ctx.db
          .insert(seo)
          .values({ pageType, title, description, image })
          .onConflictDoUpdate({
            target: seo.pageType,
            set: { title, description, image },
          });

        revalidateTag("seo");

        return result;
      },
    ),
});
