import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { tags } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const tagRouter = createTRPCRouter({
	getTags: publicProcedure.query(({ ctx }) => {
		return ctx.db.query.tags.findMany({
			orderBy: (tags, { desc }) => [desc(tags.name)],
		});
	}),

	addTag: publicProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(tags).values({
				name: input.name,
			});
		}),

	editTag: publicProcedure
		.input(z.object({ id: z.number().positive(), name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(tags)
				.set({
					name: input.name,
				})
				.where(eq(tags.id, input.id));
		}),

	deleteTag: publicProcedure
		.input(z.object({ id: z.number().positive() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(tags).where(eq(tags.id, input.id));
		}),
});
