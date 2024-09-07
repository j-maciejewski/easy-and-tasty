import { authedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { comment_likes, comments } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const authedCommentRouter = createTRPCRouter({
	addComment: authedProcedure
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

	deleteComment: authedProcedure
		.input(z.number().positive())
		.mutation(async ({ ctx, input: commentId }) => {
			await ctx.db
				.delete(comments)
				.where(and(eq(comments.id, commentId), eq(comments.userId, 1)));
		}),

	likeComment: authedProcedure
		.input(z.number().positive())
		.mutation(async ({ ctx, input: commentId }) => {
			await ctx.db.insert(comment_likes).values({
				commentId,
				userId: 1,
			});
		}),

	unlikeComment: authedProcedure
		.input(z.number().positive())
		.mutation(async ({ ctx, input: commentId }) => {
			await ctx.db
				.delete(comment_likes)
				.where(
					and(
						eq(comment_likes.commentId, commentId),
						eq(comment_likes.userId, 1),
					),
				);
		}),
});
