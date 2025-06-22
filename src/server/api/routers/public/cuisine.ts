import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { cuisines } from "@/server/db/schema";

export const publicCuisineRouter = createTRPCRouter({
  getCuisines: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.cuisines.findMany({
      orderBy: (cuisines, { asc }) => [asc(cuisines.name)],
    });
  }),

  getCuisinesSlugs: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.cuisines.findMany({
      columns: {
        slug: true,
      },
    });
  }),

  getCuisineBySlug: publicProcedure
    .input(z.string())
    .query(({ ctx, input: cuisineSlug }) => {
      return ctx.db.query.cuisines.findFirst({
        where: eq(cuisines.slug, cuisineSlug),
      });
    }),
});
