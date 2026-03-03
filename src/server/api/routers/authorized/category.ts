import { eq } from "drizzle-orm";
import { z } from "zod";

import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { categories } from "@/server/db/schema";

export const authorizedCategoryRouter = createTRPCRouter({
  getCategory: authorizedProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.query.categories.findFirst({
      orderBy: (categories, { asc }) => [asc(categories.name)],
      where: eq(categories.id, input),
    });
  }),

  getCategories: authorizedProcedure.query(({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),

  addCategory: authorizedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().min(1),
        published: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(categories).values({
        name: input.name,
        slug: input.slug,
        description: input.description,
        publishedAt: input.published ? new Date() : null,
      });
    }),

  editCategory: authorizedProcedure
    .input(
      z.object({
        id: z.number().positive(),
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().min(1),
        published: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(categories)
        .set({
          name: input.name,
          slug: input.slug,
          description: input.description,
          publishedAt: input.published ? new Date() : null,
        })
        .where(eq(categories.id, input.id));
    }),

  publishCategory: authorizedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(categories)
        .set({
          publishedAt: new Date(),
        })
        .where(eq(categories.id, input));
    }),

  unpublishCategory: authorizedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(categories)
        .set({
          publishedAt: null,
        })
        .where(eq(categories.id, input));
    }),

  deleteCategory: authorizedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input: categoryId }) => {
      await ctx.db.delete(categories).where(eq(categories.id, categoryId));
    }),
});
