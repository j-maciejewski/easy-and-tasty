import { and, eq, isNotNull } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { categories } from "@/server/db/schema";

export const publicCategoryRouter = createTRPCRouter({
  getCategories: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
      where: isNotNull(categories.publishedAt),
    });
  }),

  getCategoriesSlugs: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.categories.findMany({
      columns: {
        slug: true,
      },
      where: isNotNull(categories.publishedAt),
    });
  }),

  getCategoryBySlug: publicProcedure
    .input(z.string())
    .query(({ ctx, input: categorySlug }) => {
      return ctx.db.query.categories.findFirst({
        where: and(
          eq(categories.slug, categorySlug),
          isNotNull(categories.publishedAt),
        ),
      });
    }),
});
