import { eq, ilike } from "drizzle-orm";
import { z } from "zod";

import { pageSectionsSchema, stringifyPageSections } from "@/constants";
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

  getPageById: authorizedProcedure
    .input(z.number().positive())
    .query(({ ctx, input: pageId }) => {
      return ctx.db.query.pages.findFirst({
        where: eq(pages.id, pageId),
      });
    }),

  addPage: authorizedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        image: z.string(),
        slug: z.string().min(1),
        description: z.string().min(1),
        sections: pageSectionsSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(pages).values({
        title: input.title,
        image: input.image,
        slug: input.slug,
        description: input.description,
        content: stringifyPageSections(input.sections),
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
        sections: pageSectionsSchema,
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
          content: stringifyPageSections(input.sections),
        })
        .where(eq(pages.id, input.id));
    }),

  publishPage: authorizedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(pages)
        .set({
          publishedAt: new Date(),
        })
        .where(eq(pages.id, input));
    }),

  unpublishPage: authorizedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(pages)
        .set({
          publishedAt: null,
        })
        .where(eq(pages.id, input));
    }),

  deletePage: authorizedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(pages).where(eq(pages.id, input));
    }),
});
