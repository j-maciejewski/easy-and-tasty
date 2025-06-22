import { eq, ilike } from "drizzle-orm";
import { z } from "zod";

import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { pages } from "@/server/db/schema";

export const authorizedPageRouter = createTRPCRouter({
  getPages: authorizedProcedure.query(({ ctx }) => {
    return ctx.db.query.pages.findMany({
      orderBy: (pages, { desc }) => [desc(pages.createdAt)],
    });
  }),

  getPage: authorizedProcedure
    .input(z.string())
    .query(({ ctx, input: pageSlug }) => {
      return ctx.db.query.pages.findFirst({
        orderBy: (pages, { desc }) => [desc(pages.createdAt)],
        where: ilike(pages.slug, pageSlug),
      });
    }),

  addPage: authorizedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        image: z.string(),
        slug: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(pages).values({
        title: input.title,
        image: input.image,
        slug: input.slug,
        description: input.description,
      });
    }),

  editPage: authorizedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        image: z.string(),
        slug: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(pages)
        .set({
          title: input.title,
          image: input.image,
          slug: input.slug,
          description: input.description,
        })
        .where(eq(pages.id, input.id));
    }),
});
