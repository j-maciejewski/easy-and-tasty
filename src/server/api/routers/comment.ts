import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { comments } from "@/server/db/schema";
import { z } from "zod";

export const commentRouter = createTRPCRouter({
	addComment: publicProcedure
		.input(
			z.object({
				text: z.string().min(1),
				userId: z.number().positive(),
				recipeId: z.number().positive(),
				replyId: z.number().positive().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(comments).values({
				text: input.text,
				recipeId: input.recipeId,
				replyId: input.replyId,
				userId: 1,
			});
		}),
});
