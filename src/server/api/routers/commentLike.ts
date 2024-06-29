import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { comment_likes } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentLikeRouter = createTRPCRouter({
	likeComment: publicProcedure
		.input(z.number().positive())
		.mutation(async ({ ctx, input: commentId }) => {
			await ctx.db.insert(comment_likes).values({
				commentId,
				userId: 1,
			});
		}),

	unlikeComment: publicProcedure
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
