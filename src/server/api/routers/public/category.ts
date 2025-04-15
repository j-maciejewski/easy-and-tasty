import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { categories } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const publicCategoryRouter = createTRPCRouter({
  getCategories: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),

  getCategoriesSlugs: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.categories.findMany({
      columns: {
        slug: true,
      },
    });
  }),

  getCategoryBySlug: publicProcedure
    .input(z.string())
    .query(({ ctx, input: categorySlug }) => {
      return ctx.db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug),
      });
    }),
});
