import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { cuisines } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const protectedCuisineRouter = createTRPCRouter({
  getCuisine: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.query.cuisines.findFirst({
      orderBy: (cuisines, { asc }) => [asc(cuisines.name)],
      where: eq(cuisines.id, input),
    });
  }),

  getCuisines: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.cuisines.findMany({
      orderBy: (cuisines, { asc }) => [asc(cuisines.name)],
    });
  }),

  addCuisine: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(cuisines).values({
        name: input.name,
        slug: input.slug,
        description: input.description,
      });
    }),

  editCuisine: protectedProcedure
    .input(
      z.object({
        id: z.number().positive(),
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(cuisines)
        .set({
          name: input.name,
          slug: input.slug,
          description: input.description,
        })
        .where(eq(cuisines.id, input.id));
    }),

  deleteCuisine: protectedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input: cuisineId }) => {
      await ctx.db.delete(cuisines).where(eq(cuisines.id, cuisineId));
    }),
});
